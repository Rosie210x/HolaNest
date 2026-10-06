package com.sba301.he190020.spring.service;

import com.sba301.he190020.spring.dto.CustomerCreateRequest;
import com.sba301.he190020.spring.dto.CustomerResponse;
import com.sba301.he190020.spring.dto.CustomerUpdateRequest;
import com.sba301.he190020.spring.entity.Customer;
import com.sba301.he190020.spring.exception.ConflictException;
import com.sba301.he190020.spring.exception.ResourceNotFoundException;
import com.sba301.he190020.spring.repository.CustomerRepository;
import com.sba301.he190020.spring.specification.CustomerSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<CustomerResponse> getAll() {
        return customerRepository.findAll(Sort.by(Sort.Direction.ASC, "customerId"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Page<CustomerResponse> getPaged(int page, int size, String email, String name) {
        Specification<Customer> spec = Specification.where(CustomerSpecifications.nameContains(name))
                .and(CustomerSpecifications.emailContains(email));

        Page<Customer> result = customerRepository.findAll(spec,
                PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "customerId")));

        List<CustomerResponse> content = result.getContent().stream()
                .map(this::toResponse)
                .toList();

        return new PageImpl<>(content, result.getPageable(), result.getTotalElements());
    }

    public CustomerResponse get(Long customerId) {
        return toResponse(findCustomer(customerId));
    }

    @Transactional
    public CustomerResponse create(CustomerCreateRequest request) {
        String email = request.email().trim();
        if (customerRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Email '" + email + "' đã tồn tại trong hệ thống");
        }

        Customer customer = new Customer();
        customer.setName(request.name().trim());
        customer.setEmail(email);
        customer.setAddress(request.address().trim());
        customer.setMobileNo(request.mobileNo().trim());
customer.setRevenue(request.revenue() != null ? request.revenue().doubleValue() : null);
        return toResponse(customerRepository.save(customer));
    }

    @Transactional
    public CustomerResponse update(Long customerId, CustomerUpdateRequest request) {
        Customer customer = findCustomer(customerId);

        String newEmail = request.email().trim();
        if (!customer.getEmail().equalsIgnoreCase(newEmail) && customerRepository.existsByEmailIgnoreCase(newEmail)) {
            throw new ConflictException("Email '" + newEmail + "' đã tồn tại trong hệ thống");
        }

        customer.setName(request.name().trim());
        customer.setEmail(newEmail);
        customer.setAddress(request.address().trim());
        customer.setMobileNo(request.mobileNo().trim());
        customer.setRevenue(request.revenue());

        return toResponse(customerRepository.save(customer));
    }

    @Transactional
    public void delete(Long customerId) {
        Customer customer = findCustomer(customerId);
        customerRepository.delete(customer);
    }

    private Customer findCustomer(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng có id=" + id));
    }

    private CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
                customer.getCustomerId(),
                customer.getName(),
                customer.getEmail(),
                customer.getAddress(),
                customer.getMobileNo(),
                customer.getRevenue()
        );
    }
}