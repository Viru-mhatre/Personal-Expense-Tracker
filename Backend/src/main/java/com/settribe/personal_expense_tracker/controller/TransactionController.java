package com.settribe.personal_expense_tracker.controller;

import com.settribe.personal_expense_tracker.dto.TransactionRequest;
import com.settribe.personal_expense_tracker.dto.TransactionResponse;
import com.settribe.personal_expense_tracker.dto.TransactionSummaryResponse;
import com.settribe.personal_expense_tracker.entity.TransactionType;
import com.settribe.personal_expense_tracker.service.TransactionService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // ADD TRANSACTION
    @PostMapping
    public ResponseEntity<TransactionResponse> addTransaction(
            @Valid @RequestBody TransactionRequest request,
            Authentication authentication) {

        TransactionResponse response =
                transactionService.addTransaction(
                        request,
                        authentication.getName()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // GET ALL TRANSACTIONS WITH OPTIONAL FILTERS
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            Authentication authentication,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        List<TransactionResponse> transactions =
                transactionService.getTransactions(
                        authentication.getName(),
                        type,
                        category,
                        startDate,
                        endDate
                );

        return ResponseEntity.ok(transactions);
    }

    // UPDATE TRANSACTION
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request,
            Authentication authentication) {

        TransactionResponse response =
                transactionService.updateTransaction(
                        id,
                        request,
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    // GET TRANSACTION BY ID
    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransactionById(
            @PathVariable Long id,
            Authentication authentication) {

        TransactionResponse response =
                transactionService.getTransactionById(
                        id,
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    // DELETE TRANSACTION
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long id,
            Authentication authentication) {

        transactionService.deleteTransaction(
                id,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

    // GET TRANSACTION SUMMARY
    @GetMapping("/summary")
    public ResponseEntity<TransactionSummaryResponse> getSummary(
            Authentication authentication) {

        TransactionSummaryResponse response =
                transactionService.getSummary(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
}

