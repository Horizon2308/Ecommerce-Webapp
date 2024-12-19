import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { ProductImage } from '../../models/product.image';
import { environment } from '../../environments/environment';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogConfirmComponent } from 'src/app/ultils/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { HeaderComponent } from '../header/header.component';
import { OrderComponent } from '../order/order.component';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';
import { CommentDTO } from '../../dtos/comment.dto';
import { UserService } from '../../services/user.service';
import { LikeService } from '../../services/like.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss'],
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentIndexImage: number = 0;
  quantity: number = 1;
  isPressedAddToCart: boolean = false;

  currentPage: number = 0;
  itemsPerPage: number = 5;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];

  comments: Comment[] = [];

  commentDTO: CommentDTO = {} as CommentDTO;
  replyDTO: CommentDTO = {} as CommentDTO;

  userId: number = this.userService.getUserResponseFromLocalStorage()!.id;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private headerComponent: HeaderComponent,
    private orderComponent: OrderComponent,
    private commentService: CommentService,
    private userService: UserService,
    private likeService: LikeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    debugger;
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getProductDetails(this.productId).subscribe({
        next: (response: any) => {
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.url = `${environment.apiNest}/products/images/${product_image.image_url}`;
            });
          }
          this.product = response;
          debugger;
          this.showImage(0);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching detail:', error);
        },
      });
      this.getAllComments(this.productId, this.currentPage, this.itemsPerPage);
    }
  }

  addComment(): void {
    this.commentDTO.likes = 0;
    this.commentDTO.parent_id = 0;
    this.commentDTO.product_id = this.productId;
    this.commentDTO.user_id = this.userId;
    this.commentService.addComment(this.commentDTO).subscribe({
      next: (response: any) => {
        debugger;
        this.getAllComments(
          this.productId,
          this.currentPage,
          this.itemsPerPage
        );
        this.commentDTO.content = '';
      },
      complete: () => {},
      error: (error: any) => {
        debugger;
        console.error('Error fetching products:', error);
      },
    });
  }

  getAllComments(productId: number, page: number, limit: number): void {
    this.commentService
      .getAllCommentsByProductId(this.productId, page, limit)
      .subscribe({
        next: (response: any) => {
          debugger;
          this.comments = response.data.comments.content;
          this.comments.forEach((comment) => {
            this.likeService
              .isLikedByThisUser(this.userId, comment.id)
              .subscribe({
                next: (response: any) => {
                  debugger;
                  comment.isLikedByThisUser = true;
                },
                complete: () => {},
                error: (error: any) => {
                  debugger;
                  console.error('Error fetching products:', error);
                },
              });
          });
          this.totalPages = response.data.total_page;
          this.visiblePages = this.getVisiblePagesArray(
            this.currentPage,
            this.totalPages
          );
        },
        complete: () => {},
        error: (error: any) => {
          debugger;
          console.error('Error fetching products:', error);
        },
      });
  }

  likeButton(id: number): void {
    this.comments.forEach((comment) => {
      if (comment.id === id) {
        if (!comment.isLikedByThisUser) {
          comment.isLikedByThisUser = true;
          ++comment.likes;
          return;
        } else {
          comment.isLikedByThisUser = false;
          --comment.likes;
          return;
        }
      }
    });
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    this.getAllComments(this.productId, this.currentPage, this.itemsPerPage);
  }

  getVisiblePagesArray(page: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisblePage = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(page - halfVisblePage, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }

  showImage(index: number) {
    if (
      this.product &&
      this.product.product_images &&
      this.product.product_images.length > 0
    ) {
      if (index < 0) {
        index = 0;
      }
      if (index > this.product.product_images.length - 1) {
        index = this.product.product_images.length - 1;
      }
      this.currentIndexImage = index;
    }
  }

  thumbnailClick(index: number) {
    this.currentIndexImage = index;
  }

  nextImage(): void {
    debugger;
    this.showImage(this.currentIndexImage + 1);
  }

  decreaseQuantity(): void {
    --this.quantity;
    if (this.quantity <= 0 && this.product) {
      this.quantity = 1;
    }
  }

  increaseQuantity(): void {
    ++this.quantity;
    if (this.quantity > this.product!.quantity && this.product) {
      this.quantity = this.product!.quantity;
    }
  }

  previousImage(): void {
    debugger;
    this.showImage(this.currentIndexImage - 1);
  }

  addProductToCart() {
    debugger;
    this.isPressedAddToCart = true;
    if (this.product!.quantity <= 0) {
      let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
        width: '250px',
        data: {
          title: 'Thêm vào giỏ hàng',
          message: 'Sản phẩm hiện tại đã hết',
        },
      });
      dialogConfirm.afterClosed().subscribe((result) => {
        if (result) {
          dialogConfirm.close();
          return;
        }
      });
    }
    if (this.product && this.product!.quantity > 0) {
      this.cartService.addProductIntoCartItems(this.productId, this.quantity);
      let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
        width: '250px',
        data: {
          title: 'Thêm vào giỏ hàng',
          message: 'Thêm sản phẩm thành công',
        },
      });
      debugger;
      this.headerComponent.refreshNumberOfProducts();
      // this.headerComponent.numberOfProducts =
      //   this.cartService.getNumberOfProducts();
      //this.orderComponent.updateCartFromCartItems();
      dialogConfirm.afterClosed().subscribe((result) => {
        if (result) {
          dialogConfirm.close();
        }
      });
    } else {
      let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
        width: '250px',
        data: {
          title: 'Thêm vào giỏ hàng',
          message: 'Không thể thêm sản phẩm',
        },
      });
      dialogConfirm.afterClosed().subscribe((result) => {
        if (result) {
          dialogConfirm.close();
        }
      });
    }
  }
  buyNow(): void {
    if (this.product!.quantity <= 0) {
      let dialogConfirm = this.dialog.open(DialogConfirmComponent, {
        width: '250px',
        data: {
          title: 'Thêm vào giỏ hàng',
          message: 'Sản phẩm hiện tại đã hết',
        },
      });
      dialogConfirm.afterClosed().subscribe((result) => {
        if (result) {
          dialogConfirm.close();
          return;
        }
      });
    } else if (this.isPressedAddToCart == false && this.product!.quantity > 0) {
      this.addProductToCart();
      this.router.navigate(['/orders']);
    }
  }
}
