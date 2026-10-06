package com.sba301.he190020.spring.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import com.sba301.he190020.spring.dto.CustomerCreateRequest;
import com.sba301.he190020.spring.dto.CustomerResponse;
import com.sba301.he190020.spring.dto.CustomerUpdateRequest;
import com.sba301.he190020.spring.entity.Customer;
import com.sba301.he190020.spring.exception.ConflictException;
import com.sba301.he190020.spring.exception.ResourceNotFoundException;
import com.sba301.he190020.spring.repository.CustomerRepository;

@ExtendWith(MockitoExtension.class)
class CustomerServiceUnitTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    private Customer sampleCustomer;

    @BeforeEach
    void setUp() {
        sampleCustomer = new Customer(1L, "Nguyen Van A", "a.nguyen@gmail.com", "Hanoi", "0901234567", 1000.0);
    }
    @Test
    @DisplayName("UT-1: getAll() returns list of CustomerResponse")
    void getAll_ReturnsList() {
        when(customerRepository.findAll(any(Sort.class))).thenReturn(List.of(sampleCustomer));

        List<CustomerResponse> result = customerService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Nguyen Van A", result.get(0).name());
        verify(customerRepository, times(1)).findAll(any(Sort.class));
    }

    @Test
    @DisplayName("UT-2: get(id) - Decision FALSE (Found) -> Statement returns CustomerResponse")
    void get_CustomerExists_ReturnsResponse() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(sampleCustomer));

        CustomerResponse response = customerService.get(1L);

        assertNotNull(response);
        assertEquals(1L, response.customerId());
        verify(customerRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("UT-3: get(id) - Decision TRUE (Not Found) -> Statement throws ResourceNotFoundException")
    void get_CustomerNotFound_ThrowsException() {
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class,
                () -> customerService.get(99L));

        assertTrue(ex.getMessage().contains("Không tìm thấy khách hàng có id=99"));
        verify(customerRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("UT-4: create() - Decision TRUE (Email Exists) -> Statement throws ConflictException")
    void create_EmailExists_ThrowsConflictException() {
        CustomerCreateRequest request = new CustomerCreateRequest(null, "Nguyen Van A", "a.nguyen@gmail.com", "Hanoi", "0901234567", BigDecimal.valueOf(1000));
        when(customerRepository.existsByEmailIgnoreCase("a.nguyen@gmail.com")).thenReturn(true);

        ConflictException ex = assertThrows(ConflictException.class,
                () -> customerService.create(request));

        assertTrue(ex.getMessage().contains("đã tồn tại trong hệ thống"));
        verify(customerRepository, never()).save(any());
    }

    @Test
    @DisplayName("UT-5: create() - Decision FALSE (Email Unique) -> Statement saves and returns CustomerResponse")
    void create_ValidRequest_ReturnsCustomerResponse() {
        CustomerCreateRequest request = new CustomerCreateRequest(null, "Nguyen Van A", "a.nguyen@gmail.com", "Hanoi", "0901234567", BigDecimal.valueOf(1000));
        when(customerRepository.existsByEmailIgnoreCase("a.nguyen@gmail.com")).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenReturn(sampleCustomer);

        CustomerResponse response = customerService.create(request);

        assertNotNull(response);
        assertEquals("a.nguyen@gmail.com", response.email());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    // --- UPDATE CUSTOMER (STATEMENT & DECISION COVERAGE) ---
    @Test
    @DisplayName("UT-6: update() - Decision TRUE (Email Changed & Exists) -> Statement ném ConflictException")
    void update_NewEmailExists_ThrowsConflictException() {
        CustomerUpdateRequest request = new CustomerUpdateRequest(1L, "Nguyen Van A", "new.email@gmail.com", "Hanoi", "0901234567", 1000.0);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(sampleCustomer));
        when(customerRepository.existsByEmailIgnoreCase("new.email@gmail.com")).thenReturn(true);

        ConflictException ex = assertThrows(ConflictException.class,
                () -> customerService.update(1L, request));

        assertTrue(ex.getMessage().contains("đã tồn tại trong hệ thống"));
        verify(customerRepository, never()).save(any());
    }

    @Test
    @DisplayName("UT-7: update() - Decision FALSE (Same Email or New Unique Email) -> Statement updates Customer")
    void update_ValidRequest_ReturnsUpdatedResponse() {
        CustomerUpdateRequest request = new CustomerUpdateRequest(1L, "Nguyen Van B", "a.nguyen@gmail.com", "Danang", "0987654321", 2000.0);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(sampleCustomer));
        when(customerRepository.save(any(Customer.class))).thenReturn(sampleCustomer);

        CustomerResponse response = customerService.update(1L, request);

        assertNotNull(response);
        verify(customerRepository, times(1)).save(sampleCustomer);
    }

    // --- DELETE CUSTOMER (STATEMENT COVERAGE) ---
    @Test
    @DisplayName("UT-8: delete() - Deletes customer successfully when found")
    void delete_CustomerExists_DeletesCustomer() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(sampleCustomer));
        doNothing().when(customerRepository).delete(sampleCustomer);

        assertDoesNotThrow(() -> customerService.delete(1L));
        verify(customerRepository, times(1)).delete(sampleCustomer);
    }
}