# Gateways for System Design Interviews

## 📋 Table of Contents

1. [Gateway Fundamentals](#gateway-fundamentals)
2. [Internet Gateway (IGW)](#internet-gateway-igw)
3. [NAT Gateway](#nat-gateway)
4. [Virtual Private Gateway (VGW)](#virtual-private-gateway-vgw)
5. [Transit Gateway (TGW)](#transit-gateway-tgw)
6. [API Gateway](#api-gateway)
7. [Gateway Comparison](#gateway-comparison)
8. [Gateway in System Design](#gateway-in-system-design)
9. [Cost, Limits, and Trade-offs](#cost-limits-and-trade-offs)
10. [Common Interview Questions](#common-interview-questions)

---

## 🚪 Gateway Fundamentals

### What is a Gateway?

```text
Definition: Entry/exit point for network traffic between different networks

Core concept:
├── Acts as intermediary between two networks
├── Translates protocols, addresses, or routes traffic
├── Controls access and applies policies
└── Enables communication between isolated networks

Analogy: Airport terminal
├── Gateway = International terminal
├── Connects domestic (private) to international (public)
├── Handles customs, security, translation
└── Controls who/what can pass through
```

### Types of Gateways in AWS

```text
1. Internet Gateway (IGW):
   ├── Connects VPC to internet
   ├── Bidirectional (inbound + outbound)
   ├── Free
   └── Use: Public-facing resources

2. NAT Gateway:
   ├── Outbound internet access for private subnets
   ├── Unidirectional (outbound only)
   ├── Paid ($0.045/hour + data)
   └── Use: Private resources need internet

3. Virtual Private Gateway (VGW):
   ├── VPN endpoint for VPC
   ├── Connects on-premises to AWS
   ├── Paid ($0.05/hour per connection)
   └── Use: Hybrid cloud, site-to-site VPN

4. Transit Gateway (TGW):
   ├── Hub for multiple VPCs and networks
   ├── Transitive routing
   ├── Paid ($0.05/hour per attachment)
   └── Use: Multi-VPC, complex networking

5. API Gateway:
   ├── Managed API service
   ├── HTTP/REST/WebSocket APIs
   ├── Paid (per request)
   └── Use: Serverless, microservices

6. Egress-Only Internet Gateway:
   ├── IPv6 outbound only
   ├── Like NAT Gateway for IPv6
   ├── Free
   └── Use: IPv6 private subnets
```

---

## 🌐 Internet Gateway (IGW)

### Overview

```text
Definition: Horizontally scaled, redundant, highly available VPC component
Purpose: Allow communication between VPC and internet

Characteristics:
├── Fully managed by AWS (no maintenance)
├── Highly available (multi-AZ by default)
├── No bandwidth constraints
├── Free (no charge)
├── One IGW per VPC
└── Supports IPv4 and IPv6

Functions:
1. NAT for instances with public IPs
2. Route target for internet-bound traffic
3. Bidirectional (inbound + outbound)
```

---
```

### Q5. What is the purpose of Virtual Private Gateway?

**Answer:**

```text
Purpose: VPN endpoint on AWS side for secure on-premises connectivity

Use cases:
├── Hybrid cloud: Extend on-premises to AWS
├── Disaster recovery: Backup to AWS
├── Cloud migration: Gradual migration
├── Compliance: Keep sensitive data on-premises
└── Burst capacity: Scale to cloud during peaks

Components:
├── Virtual Private Gateway (VGW): AWS VPN endpoint
├── Customer Gateway (CGW): On-premises VPN device
├── VPN Connection: IPsec tunnels (2 for HA)
└── Route propagation: BGP for dynamic routing

Setup:
1. Create VGW and attach to VPC
2. Create CGW with on-premises public IP
3. Create VPN connection (links VGW and CGW)
4. Download configuration for on-premises device
5. Configure routing (static or BGP)

Benefits:
├── Encrypted: IPsec over internet
├── Quick setup: Hours, not weeks
├── Cost-effective: $36/month
├── HA: Two tunnels automatic
└── Flexible: Easy to add/remove

Limitations:
├── Bandwidth: 1.25 Gbps per tunnel
├── Latency: Variable (over internet)
├── Availability: Depends on internet connection
└── Alternative: Direct Connect for higher bandwidth
```

---

> Gateways are critical components for connecting networks in AWS. Understanding when to use each type—Internet Gateway for public access, NAT Gateway for private outbound, VPN for hybrid cloud, Transit Gateway for multi-VPC, and API Gateway for APIs—is essential for system design interviews.
