package com.duchung.shopappspring.controllers;

import com.duchung.shopappspring.domains.OrderStatus;
import com.duchung.shopappspring.dtos.OrderDTO;
import com.duchung.shopappspring.exceptions.DataNotFoundException;
import com.duchung.shopappspring.exceptions.InvalidParameterException;
import com.duchung.shopappspring.http_responses.ErrorResponse;
import com.duchung.shopappspring.http_responses.SuccessResponse;
import com.duchung.shopappspring.responses.OrderListResponse;
import com.duchung.shopappspring.responses.OrderResponse;
import com.duchung.shopappspring.services.IOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/orders")
public class OrderController {

    private final IOrderService orderService;

    @GetMapping("")
    public ResponseEntity<?> getAllOrders(@RequestParam(value = "page", defaultValue = "0") Integer page,
                                          @RequestParam(value = "limit", defaultValue = "10") Integer limit,
                                          @RequestParam(defaultValue = "", value = "keyword") String keyword) {
        Page<OrderResponse> orderResponseList = orderService.getAllOrders(PageRequest.of(page, limit), keyword);
        int totalPage = orderResponseList.getTotalPages();
        if (totalPage == 0) {
            return ResponseEntity.ok(new SuccessResponse<>("Orders are empty!"));
        }
        return ResponseEntity.ok().body(new SuccessResponse<>(OrderListResponse.builder()
                .ordersList(orderResponseList)
                .totalPage(totalPage)
                .build(), "Get all orders"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable("id") Long orderId) {
        try {
            return ResponseEntity.ok(new SuccessResponse<>(orderService.getOrderById(orderId),
                    "Get order with id: " + orderId));
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse<>(e.getMessage()));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getOrdersByUserId(@RequestParam("user_id") Long userId,
                                               @RequestParam(value = "page", defaultValue = "0") Integer page,
                                               @RequestParam(value = "limit",defaultValue = "5") Integer limit) {
        try {
            Page<OrderResponse> orders = orderService.getAllOrdersByUserId(userId,
                    PageRequest.of(page, limit));
            int totalPages = orders.getTotalPages();
            if (totalPages == 0) {
                return ResponseEntity.ok(new SuccessResponse<>("Products page is empty!"));
            }
            if (orders.getContent().isEmpty()) {
                return ResponseEntity.ok(new SuccessResponse<>("Products page is empty!"));
            }
            return ResponseEntity.ok().body(new SuccessResponse<>(OrderListResponse.builder()
                    .ordersList(orders)
                    .totalPage(totalPages)
                    .build()));
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse<>(e.getMessage()));
        }
    }

    @PostMapping("")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderDTO orderDTO,
                                         BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(new ErrorResponse<>(errorMessages));
        }
        try {
            return ResponseEntity.accepted().body(new SuccessResponse<>(orderService.createOrder(orderDTO),
                    "Created successfully!"));
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse<>(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable("id") Long orderId,
                                         @Valid @RequestBody OrderDTO orderDTO,
                                         BindingResult result) {
        if(result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(new ErrorResponse<>(errorMessages));
        }
        try {
            return ResponseEntity.accepted().body(new SuccessResponse<>(orderService.updateOrder(orderId,
                    orderDTO), "Updated an order which has id: " + orderId));
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse<>(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable("id") Long orderId) {
        try {
            orderService.deleteOrder(orderId);
            return ResponseEntity.ok().body(new SuccessResponse<>("Deleted an order which has id: " + orderId));
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse<>(e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/change-status/{id}/{new_status}")
    public ResponseEntity<?> changeStatus(
                                          @PathVariable("new_status") String newStatus,
                                          @PathVariable("id") Long orderId) {
        try {
            return ResponseEntity.ok(new SuccessResponse<>(orderService.updateStatus(orderId, newStatus), "Changed status successfully"));
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse<>(e.getMessage()));
        } catch (InvalidParameterException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse<>("Invalid date"));
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/count")
    public ResponseEntity<?> countOrders() {
        return ResponseEntity.ok(new SuccessResponse<>(orderService.countOrders()));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/get-latest-orders")
    public ResponseEntity<?> getLatestOrders() {
        return ResponseEntity.ok(new SuccessResponse<>(orderService.getLatestOrder()));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/count/get-total-money")
    public ResponseEntity<?> getTotalMoney() {
        return ResponseEntity.ok(new SuccessResponse<>(orderService.getTotalMoney()));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/count/cancelled-order")
    public ResponseEntity<?> countCancelledOrder() {
        return ResponseEntity.ok(new SuccessResponse<>(orderService.countCancelledOrder()));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/statistic/get-successful-orders")
    public ResponseEntity<?> getSuccessfulOrders() {
        return ResponseEntity.ok(new SuccessResponse<>(orderService.getSuccessfulOrder()));
    }
}
