package com.amittraders.leather.service;

import com.amittraders.leather.dto.ClientRequest;
import com.amittraders.leather.dto.ClientResponse;
import com.amittraders.leather.dto.ReorderRequest;
import com.amittraders.leather.entity.Client;
import com.amittraders.leather.exception.ResourceNotFoundException;
import com.amittraders.leather.mapper.EntityMapper;
import com.amittraders.leather.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Transactional(readOnly = true)
    public List<ClientResponse> listActive() {
        return clientRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(EntityMapper::toClientResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClientResponse> listAll() {
        return clientRepository.findAll().stream()
                .sorted((a, b) -> Integer.compare(a.getDisplayOrder(), b.getDisplayOrder()))
                .map(EntityMapper::toClientResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClientResponse getById(Long id) {
        return EntityMapper.toClientResponse(findById(id));
    }

    @Transactional
    public ClientResponse create(ClientRequest request) {
        Client client = Client.builder()
                .companyName(request.companyName().trim())
                .logoUrl(request.logoUrl())
                .description(request.description())
                .displayOrder(request.displayOrder() != null ? request.displayOrder() : 0)
                .active(request.active() == null || request.active())
                .build();
        return EntityMapper.toClientResponse(clientRepository.save(client));
    }

    @Transactional
    public ClientResponse update(Long id, ClientRequest request) {
        Client client = findById(id);
        client.setCompanyName(request.companyName().trim());
        client.setLogoUrl(request.logoUrl());
        client.setDescription(request.description());
        if (request.displayOrder() != null) {
            client.setDisplayOrder(request.displayOrder());
        }
        if (request.active() != null) {
            client.setActive(request.active());
        }
        return EntityMapper.toClientResponse(clientRepository.save(client));
    }

    @Transactional
    public void delete(Long id) {
        clientRepository.delete(findById(id));
    }

    @Transactional
    public void reorder(ReorderRequest request) {
        for (ReorderRequest.ReorderItem item : request.items()) {
            Client client = findById(item.id());
            client.setDisplayOrder(item.displayOrder());
            clientRepository.save(client);
        }
    }

    private Client findById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + id));
    }
}
