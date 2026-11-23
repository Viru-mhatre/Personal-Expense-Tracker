package com.settribe.personal_expense_tracker.repository;

import com.settribe.personal_expense_tracker.entity.Transaction;
import com.settribe.personal_expense_tracker.entity.TransactionType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {


    // Get all transactions of a user with optional filters
    @Query("""
        SELECT t FROM Transaction t
        WHERE t.user.id = :userId
        AND (:type IS NULL OR t.type = :type)
        AND (:category IS NULL OR t.category = :category)
        AND (:startDate IS NULL OR t.transactionDate >= :startDate)
        AND (:endDate IS NULL OR t.transactionDate <= :endDate)
        ORDER BY t.transactionDate DESC
    """)
    List<Transaction> findFilteredTransactions(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
    SELECT COALESCE(SUM(t.amount), 0)
    FROM Transaction t
    WHERE t.user.id = :userId
    AND t.type = :type
""")
    java.math.BigDecimal calculateTotalByType(
            @Param("userId") Long userId,
            @Param("type") TransactionType type
    );


    // Find transaction belonging to a particular user
    Optional<Transaction> findByIdAndUser_Id(
            Long id,
            Long userId
    );
}
