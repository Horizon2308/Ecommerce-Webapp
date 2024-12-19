import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionDocument } from 'src/app/manager/models/transaction.document';
import { TransactionDocumentService } from 'src/app/manager/services/transaction.document.service';
import { environment } from 'src/app/user/environments/environment';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-export-transaction-document',
  templateUrl: './export-transaction-document.component.html',
  styleUrls: ['./export-transaction-document.component.scss'],
})
export class ExportTransactionDocumentComponent implements OnInit {
  transactionDocuments: TransactionDocument[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  sortOption: number = 1;
  index: number = 0;
  userName: string =
    this.userService.getUserResponseFromLocalStorage()!.fullname;
  avatar = `${environment.apiBaseUrl}/users/avatar/${this.userService.getUserResponseFromLocalStorage()!.avatar}`

  constructor(
    private transactionDocumentService: TransactionDocumentService,
    private userService: UserService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getAllTransactionDocuments(
      this.sortOption,
      this.keyword,
      this.currentPage,
      this.itemsPerPage
    );
  }

  getAllTransactionDocuments(
    sortOption: number,
    keyword: string,
    page: number,
    limit: number
  ): void {
    this.transactionDocumentService
      .getAllExportTransactionDocuments(sortOption, keyword, page, limit)
      .subscribe({
        next: (response: any) => {
          debugger;
          this.transactionDocuments =
            response.data.transaction_documents.content;
          this.totalPages = response.data.total_page;
          this.visiblePages = this.getVisiblePagesArray(
            this.currentPage,
            this.totalPages
          );
          this.index = 0;
        },
        complete: () => {},
        error: (error: any) => {
          console.error('Error fetching transaction document:', error);
        },
      });
  }
  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    this.getAllTransactionDocuments(
      this.sortOption,
      this.keyword,
      this.currentPage,
      this.itemsPerPage
    );
  }

  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    debugger;
    this.getAllTransactionDocuments(
      this.sortOption,
      this.keyword,
      this.currentPage,
      this.itemsPerPage
    );
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

  transactionDocumentDetailsClick(id: number) {
    this.router.navigate(['/manager/export-transaction-document-details', id]);
  }
}
