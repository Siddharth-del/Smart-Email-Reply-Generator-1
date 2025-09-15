package com.email.writer;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins="*")
public class EmailGeneratorController {

    private final EmailGeneratorService emailGeneratorService;
    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest) throws JsonProcessingException{
       String response=emailGeneratorService.generateEmailReply(emailRequest);
        return  ResponseEntity.ok(response);

    }
}
