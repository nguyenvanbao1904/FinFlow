/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nvb.pojos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Set;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 *
 * @author nguyenvanbao
 */
@Entity
@Table(name = "portfolios")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;
    
    @OneToMany(mappedBy = "portfolio")
    private Set<StockTransaction> stockTransactions;
    
    @OneToMany(mappedBy = "portfolio")
    private Set<StockHolding> stockHoldings;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt; 
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;  

    public Portfolio() {
    }

    public Portfolio(String name, User user, Set<StockTransaction> stockTransactions, Set<StockHolding> stockHoldings) {
        this.name = name;
        this.user = user;
        this.stockTransactions = stockTransactions;
        this.stockHoldings = stockHoldings;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<StockTransaction> getStockTransactions() {
        return stockTransactions;
    }

    public void setStockTransactions(Set<StockTransaction> stockTransactions) {
        this.stockTransactions = stockTransactions;
    }

    public Set<StockHolding> getStockHoldings() {
        return stockHoldings;
    }

    public void setStockHoldings(Set<StockHolding> stockHoldings) {
        this.stockHoldings = stockHoldings;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
