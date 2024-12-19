package com.duchung.shopappspring.repositories;

import com.duchung.shopappspring.models.Comment;
import com.duchung.shopappspring.models.Like;
import com.duchung.shopappspring.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {
    //boolean existByUserAndComment(User user, Comment comment);
}
