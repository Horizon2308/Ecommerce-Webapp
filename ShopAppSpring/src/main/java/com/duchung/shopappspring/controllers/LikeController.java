//package com.duchung.shopappspring.controllers;
//
//import com.duchung.shopappspring.http_responses.SuccessResponse;
//import com.duchung.shopappspring.models.Comment;
//import com.duchung.shopappspring.models.User;
//import com.duchung.shopappspring.repositories.CommentRepository;
//import com.duchung.shopappspring.repositories.LikeRepository;
//import com.duchung.shopappspring.repositories.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("${api.prefix}/likes")
//public class LikeController {
//
//    private final LikeRepository likeRepository;
//    private final UserRepository userRepository;
//    private final CommentRepository commentRepository;
//
//    @GetMapping("")
//    public ResponseEntity<?> isLikedByThisUser(@RequestParam("user_id") Long userId,
//                                               @RequestParam("comment_id") Long commentId) {
//        User user = userRepository.findById(userId).get();
//        Comment comment = commentRepository.findById(commentId).get();
//        boolean isLiked = likeRepository.existByUserAndComment(user, comment);
//        if (isLiked) {
//            return ResponseEntity.ok(new SuccessResponse<>("Yes"));
//        } else {
//            return ResponseEntity.ok(new SuccessResponse<>("No"));
//        }
//    }
//}
