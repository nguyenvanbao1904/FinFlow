package com.nvb.fin_flow.specification;

import com.nvb.fin_flow.entity.Category;
import com.nvb.fin_flow.entity.Transaction;
import com.nvb.fin_flow.entity.User;
import com.nvb.fin_flow.exception.AppException;
import com.nvb.fin_flow.exception.ErrorCode;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class TransactionSpecifications {
    public static Specification<Transaction> belongToUser(String username){
        return (root, query, cb) ->{
            if(username == null || username.isEmpty()) {
                return null;
            }
            Join<Transaction, User> userJoin = root.join("user");
            return cb.equal(userJoin.get("username"), username);
        };
    }

    public static Specification<Transaction> between(String from, String to) {
        return (root, query, cb) -> {
            if(from == null || to == null) {
                throw new AppException(ErrorCode.PARAMS_INVALID);
            }
            try{
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                LocalDate startDate = LocalDate.parse(from, formatter);
                LocalDate endDate = LocalDate.parse(to, formatter);
                if(endDate.isBefore(startDate)) {
                    throw new AppException(ErrorCode.PARAMS_INVALID);
                }
                return cb.between(root.get("date"), startDate, endDate);
            }catch(DateTimeParseException e){
                throw new AppException(ErrorCode.PARAMS_INVALID);
            }
        };
    }
}
