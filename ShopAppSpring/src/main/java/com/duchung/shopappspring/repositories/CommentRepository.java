package com.duchung.shopappspring.repositories;


import com.duchung.shopappspring.models.Comment;
import com.duchung.shopappspring.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findAllByProduct(Product product, Pageable pageable);
}