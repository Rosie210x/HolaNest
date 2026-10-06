package com.sba301.he190020.spring.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.sba301.he190020.spring.entity.AppUser;
import com.sba301.he190020.spring.entity.Customer;
import com.sba301.he190020.spring.entity.Role;
import com.sba301.he190020.spring.repository.AppUserRepository;
import com.sba301.he190020.spring.repository.CustomerRepository;



@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(AppUserRepository userRepository,
                               CustomerRepository customerRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(createUser("admin@sba301.com", passwordEncoder.encode("123456"), "ADMIN"));
                userRepository.save(createUser("user@sba301.com", passwordEncoder.encode("123456"), "USER"));
            }
            if (customerRepository.count() == 0) {
                customerRepository.save(createCustomer(
                        "Nguyen Van A", 
                        "a.nguyen@gmail.com", 
                        "123 Le Loi, District 1, HCMC", 
                        "0901234567", 
                        "15000000.00"
                ));
                customerRepository.save(createCustomer(
                        "Tran Thi B", 
                        "b.tran@gmail.com", 
                        "456 Tran Hung Dao, Hoan Kiem, Hanoi", 
                        "0912345678", 
                        "8500000.50"
                ));

                customerRepository.save(createCustomer(
                        "Le Van C", 
                        "c.le@gmail.com", 
                        "789 Nguyen Van Linh, Hai Chau, Da Nang", 
                        "0987654321", 
                        "23000000.00"
                ));
            }
        };
    }

    private AppUser createUser(String email, String encodedPassword, String role) {
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setPassword(encodedPassword);
user.setRole(Role.valueOf(role.toUpperCase()));      
  return user;
    }

    private Customer createCustomer(String name, String email, String address, String mobileNo, String revenue) {
        Customer customer = new Customer();
        customer.setName(name);
        customer.setEmail(email);
        customer.setAddress(address);
        customer.setMobileNo(mobileNo);
        customer.setRevenue(new Double(revenue));
        return customer;
    }
}