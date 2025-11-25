package org.example.be.controller;

import lombok.RequiredArgsConstructor;
import org.example.be.dto.LoginRequest;
import org.example.be.dto.RegisterRequest;
import org.example.be.entity.Member;
import org.example.be.service.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {

    private final MemberService memberService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        return memberService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        Member savedMember = memberService.save(member);
        return new ResponseEntity<>(savedMember, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member memberDetails) {
        return memberService.findById(id)
                .map(member -> {
                    member.setFullName(memberDetails.getFullName());
                    member.setAvatarUrl(memberDetails.getAvatarUrl());
                    member.setPassword(memberDetails.getPassword());
                    return ResponseEntity.ok(memberService.save(member));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest req) {
        if (memberService.findByUsername(req.getUsername()).isPresent()) {
            return "Username already exists";
        }
        Member member = new Member();
        // Encode the password before saving
        member.setUsername(req.getUsername());
        member.setPassword(passwordEncoder.encode(req.getPassword()));
        member.setEmail(req.getEmail());
        member.setFullName(req.getFullName());
        memberService.save(member);
        return "Registration successful for user: " + req.getFullName();
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest req) {
        Member existingMember = memberService.findByUsername(req.getUsername()).orElse(null);
        System.out.println(existingMember.getFullName());

        if (existingMember == null) {

            return "User not found";
        }

        if (!passwordEncoder.matches(req.getPassword(), existingMember.getPassword())) {
            return "Wrong password";
        }
        return "Login successful for user: " + req.getUsername();
    }

}