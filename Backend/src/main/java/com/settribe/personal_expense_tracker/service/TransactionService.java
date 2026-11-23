package com.settribe.personal_expense_tracker.service;

import com.settribe.personal_expense_tracker.dto.TransactionRequest;
import com.settribe.personal_expense_tracker.dto.TransactionResponse;
import com.settribe.personal_expense_tracker.dto.TransactionSummaryResponse;

import com.settribe.personal_expense_tracker.entity.Transaction;
import com.settribe.personal_expense_tracker.entity.TransactionType;
import com.settribe.personal_expense_tracker.entity.User;

import com.settribe.personal_expense_tracker.repository.TransactionRepository;
import com.settribe.personal_expense_tracker.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository) {

        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    // GET AUTHENTICATED USER
    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }

    // ADD TRANSACTION
    public TransactionResponse addTransaction(
            TransactionRequest request,
            String email) {

        User user = getUser(email);

        Transaction transaction = new Transaction();

        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory().trim());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setUser(user);

        Transaction saved =
                transactionRepository.save(transaction);

        return new TransactionResponse(saved);
    }

    // GET TRANSACTIONS WITH FILTERS
    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactions(
            String email,
            TransactionType type,
            String category,
            LocalDate startDate,
            LocalDate endDate) {

        User user = getUser(email);

        if (startDate != null && endDate != null
                && startDate.isAfter(endDate)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Start date cannot be after end date"
            );
        }

        List<Transaction> transactions =
                transactionRepository.findFilteredTransactions(
                        user.getId(),
                        type,
                        category,
                        startDate,
                        endDate
                );

        return transactions.stream()
                .map(TransactionResponse::new)
                .toList();
    }

    // GET TRANSACTION BY ID
    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(Long id, String email) {

        User user = getUser(email);

        Transaction transaction =
                transactionRepository.findByIdAndUser_Id(
                        id,
                        user.getId()
                ).orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Transaction not found"
                ));

        return new TransactionResponse(transaction);
    }

    // UPDATE TRANSACTION
    public TransactionResponse updateTransaction(
            Long id,
            TransactionRequest request,
            String email) {

        User user = getUser(email);

        Transaction transaction =
                transactionRepository.findByIdAndUser_Id(
                        id,
                        user.getId()
                ).orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Transaction not found"
                ));

        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory().trim());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());

        Transaction updated =
                transactionRepository.save(transaction);

        return new TransactionResponse(updated);
    }

    // DELETE TRANSACTION
    public void deleteTransaction(Long id, String email) {

        User user = getUser(email);

        Transaction transaction =
                transactionRepository.findByIdAndUser_Id(
                        id,
                        user.getId()
                ).orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Transaction not found"
                ));

        transactionRepository.delete(transaction);
    }

    // DASHBOARD SUMMARY
    @Transactional(readOnly = true)
    public TransactionSummaryResponse getSummary(String email) {

        User user = getUser(email);

        BigDecimal totalIncome =
                transactionRepository.calculateTotalByType(
                        user.getId(),
                        TransactionType.INCOME
                );

        BigDecimal totalExpense =
                transactionRepository.calculateTotalByType(
                        user.getId(),
                        TransactionType.EXPENSE
                );

        BigDecimal balance = totalIncome.subtract(totalExpense);

        return new TransactionSummaryResponse(
                totalIncome,
                totalExpense,
                balance
        );
    }
}
