package com.duchung.shopappspring.services;

import com.duchung.shopappspring.dtos.CommentDTO;
import com.duchung.shopappspring.exceptions.DataNotFoundException;
import com.duchung.shopappspring.models.Comment;
import com.duchung.shopappspring.models.Product;
import com.duchung.shopappspring.models.User;
import com.duchung.shopappspring.repositories.CommentRepository;
import com.duchung.shopappspring.repositories.ProductRepository;
import com.duchung.shopappspring.repositories.UserRepository;
import com.duchung.shopappspring.responses.CommentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {

    private final CommentRepository commentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public Page<CommentResponse> getCommentsByProductId(Long productId, Pageable pageable) throws DataNotFoundException {
        if (!productRepository.existsById(productId)) {
            throw new DataNotFoundException("Product not found!");
        }
        Product product = productRepository.findById(productId).get();
        return commentRepository.findAllByProduct(product, pageable).map(this::convertToCommentResponse);
    }

    @Override
    @Transactional
    public void addComment(CommentDTO commentDTO) throws DataNotFoundException {
        User user = userRepository.findById(commentDTO.getUserId())
                .orElseThrow(() -> new DataNotFoundException("User not found!"));
        Product product = productRepository.findById(commentDTO.getProductId())
                .orElseThrow(() -> new DataNotFoundException("Product not found!"));
        commentRepository.save(convertToComment(commentDTO, user, product));
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId) throws DataNotFoundException {
        Comment deletedComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new DataNotFoundException("Comment not found"));
        commentRepository.delete(deletedComment);
    }

    private Comment convertToComment(CommentDTO commentDTO, User user, Product product) {
        return Comment.builder()
                .user(user)
                .product(product)
                .content(commentDTO.getContent())
                .likes(0L)
                .parent_id(0L)
                .build();
    }

    private CommentResponse convertToCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .productId(comment.getProduct().getId())
                .content(comment.getContent())
                .likes(comment.getLikes())
                .parent_id(comment.getParent_id())
                .username(comment.getUser().getFullName())
                .createdAt(comment.getCreateAt())
                .build();
    }
}
