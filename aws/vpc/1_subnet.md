# AWS VPC Subnets

## What is a Subnet?

A **subnet** (subnetwork) is a logical subdivision of your VPC's IP address range. It's a way to segment your VPC into smaller, more manageable network segments where you can place AWS resources like EC2 instances, RDS databases, and load balancers.

## Key Subnet Concepts

### **CIDR Blocks**
- Each subnet has its own **CIDR block** (subset of VPC CIDR)
- Must be within the VPC's CIDR range
- Cannot overlap with other subnets in the same VPC

### **Availability Zone Mapping**
- Each subnet exists in **exactly one Availability Zone**
- Cannot span multiple AZs
- Resources in subnet inherit the AZ placement

## Subnet Types

### 1. **Public Subnet**
- Has a **route to Internet Gateway** (IGW)
- Resources can have **public IP addresses**
- **Direct internet access** for inbound/outbound traffic

### 2. **Private Subnet**
- **No direct route** to Internet Gateway
- Resources typically have **only private IP addresses**
- Uses **NAT Gateway/Instance** for outbound internet access

### 3. **Isolated Subnet**
- **No internet access** at all (no NAT)
- Completely **isolated** from internet
- Used for highly sensitive resources

## Subnet Architecture Diagram

```mermaid
graph TB
    Internet[Internet]
    IGW[Internet Gateway]
    
    subgraph VPC["VPC (10.0.0.0/16)"]
        subgraph AZ1["Availability Zone 1a"]
            subgraph PublicSub1["Public Subnet (10.0.1.0/24)"]
                Web1[Web Server<br/>Public IP: Yes<br/>Internet Access: Direct]
            end
            subgraph PrivateSub1["Private Subnet (10.0.2.0/24)"]
                App1[App Server<br/>Public IP: No<br/>Internet Access: via NAT]
                NAT1[NAT Gateway]
            end
            subgraph IsolatedSub1["Isolated Subnet (10.0.3.0/24)"]
                DB1[Database<br/>Public IP: No<br/>Internet Access: None]
            end
        end
        
        subgraph AZ2["Availability Zone 1b"]
            subgraph PublicSub2["Public Subnet (10.0.4.0/24)"]
                Web2[Web Server<br/>Public IP: Yes<br/>Internet Access: Direct]
            end
            subgraph PrivateSub2["Private Subnet (10.0.5.0/24)"]
                App2[App Server<br/>Public IP: No<br/>Internet Access: via NAT]
                NAT2[NAT Gateway]
            end
            subgraph IsolatedSub2["Isolated Subnet (10.0.6.0/24)"]
                DB2[Database<br/>Public IP: No<br/>Internet Access: None]
            end
        end
    end
    
    Internet --> IGW
    IGW --> Web1
    IGW --> Web2
    NAT1 --> IGW
    NAT2 --> IGW
    App1 --> NAT1
    App2 --> NAT2
    Web1 --> App1
    Web2 --> App2
    App1 --> DB1
    App2 --> DB2
    
    style VPC fill:#e1f5fe
    style AZ1 fill:#f0f0f0
    style AZ2 fill:#f0f0f0
    style PublicSub1 fill:#c8e6c9
    style PublicSub2 fill:#c8e6c9
    style PrivateSub1 fill:#ffecb3
    style PrivateSub2 fill:#ffecb3
    style IsolatedSub1 fill:#ffcdd2
    style IsolatedSub2 fill:#ffcdd2
```

## Subnet Routing

### Route Tables
Each subnet must be **associated with a route table** that controls traffic routing:

```mermaid
graph LR
    subgraph RT1["Public Route Table"]
        PubRoute1["0.0.0.0/0 → IGW<br/>10.0.0.0/16 → Local"]
    end
    
    subgraph RT2["Private Route Table"]
        PrivRoute1["0.0.0.0/0 → NAT Gateway<br/>10.0.0.0/16 → Local"]
    end
    
    subgraph RT3["Isolated Route Table"]
        IsoRoute1["10.0.0.0/16 → Local<br/>(No internet route)"]
    end
    
    PublicSubnet[Public Subnet] --> RT1
    PrivateSubnet[Private Subnet] --> RT2
    IsolatedSubnet[Isolated Subnet] --> RT3
    
    style RT1 fill:#c8e6c9
    style RT2 fill:#ffecb3
    style RT3 fill:#ffcdd2
```

## Subnet IP Address Management

### **Reserved IP Addresses**
AWS reserves **5 IP addresses** in each subnet:

```mermaid
graph TB
    subgraph Subnet["Subnet: 10.0.1.0/24 (256 addresses)"]
        Reserved["Reserved Addresses (5)"]
        Available["Available Addresses (251)"]
        
        subgraph ReservedIPs["Reserved IPs"]
            IP1["10.0.1.0 - Network Address"]
            IP2["10.0.1.1 - VPC Router"]
            IP3["10.0.1.2 - DNS Server"]
            IP4["10.0.1.3 - Future Use"]
            IP5["10.0.1.255 - Broadcast"]
        end
        
        subgraph AvailableRange["Available Range"]
            Range["10.0.1.4 to 10.0.1.254<br/>(251 usable addresses)"]
        end
    end
    
    style Reserved fill:#ffcdd2
    style Available fill:#c8e6c9
    style ReservedIPs fill:#ffcdd2
    style AvailableRange fill:#c8e6c9
```

## Subnet Sizing Examples

### Common CIDR Block Sizes

```mermaid
graph TB
    subgraph VPC["VPC: 10.0.0.0/16 (65,536 addresses)"]
        subgraph Small["/28 Subnets (16 addresses each)"]
            S1["10.0.1.0/28<br/>11 usable IPs"]
            S2["10.0.1.16/28<br/>11 usable IPs"]
        end
        
        subgraph Medium["/24 Subnets (256 addresses each)"]
            M1["10.0.2.0/24<br/>251 usable IPs"]
            M2["10.0.3.0/24<br/>251 usable IPs"]
        end
        
        subgraph Large["/20 Subnets (4,096 addresses each)"]
            L1["10.0.16.0/20<br/>4,091 usable IPs"]
            L2["10.0.32.0/20<br/>4,091 usable IPs"]
        end
    end
    
    style Small fill:#ffecb3
    style Medium fill:#c8e6c9
    style Large fill:#e1f5fe
```

## Subnet Security

### Network ACLs (Subnet Level)

```mermaid
graph TB
    subgraph NACL["Network ACL Rules"]
        subgraph Inbound["Inbound Rules"]
            In1["Rule 100: HTTP (80) - ALLOW"]
            In2["Rule 110: HTTPS (443) - ALLOW"]
            In3["Rule 120: SSH (22) - DENY"]
            In4["Rule *: ALL - DENY"]
        end
        
        subgraph Outbound["Outbound Rules"]
            Out1["Rule 100: HTTP (80) - ALLOW"]
            Out2["Rule 110: HTTPS (443) - ALLOW"]
            Out3["Rule 120: ALL - ALLOW"]
        end
    end
    
    SubnetTraffic[Subnet Traffic] --> NACL
    NACL --> SecurityGroups["Security Groups<br/>(Instance Level)"]
    
    style Inbound fill:#ffecb3
    style Outbound fill:#c8e6c9
    style NACL fill:#e1f5fe
```

## Subnet Best Practices

### **1. Multi-AZ Design**
- Deploy subnets across **multiple AZs** for high availability
- Use **consistent CIDR planning** across AZs

### **2. Subnet Sizing**
- Plan for **future growth** when choosing CIDR blocks
- Consider **reserved IP addresses** (5 per subnet)
- Use **/24** for most workloads (251 usable IPs)

### **3. Security Layering**
- **Public subnets**: Only for internet-facing resources
- **Private subnets**: For application servers and internal services
- **Isolated subnets**: For databases and sensitive data

### **4. Route Table Management**
- Use **separate route tables** for different subnet types
- Keep routing **simple and predictable**
- Document route table associations

## Common Subnet Patterns

### **Three-Tier Architecture**

```mermaid
graph TB
    Users[Users] --> ALB[Application Load Balancer]
    
    subgraph VPC["VPC"]
        subgraph PublicTier["Public Tier (DMZ)"]
            ALB --> Web1[Web Server 1]
            ALB --> Web2[Web Server 2]
        end
        
        subgraph PrivateTier["Private Tier (App Layer)"]
            Web1 --> App1[App Server 1]
            Web2 --> App2[App Server 2]
        end
        
        subgraph DataTier["Data Tier (Database Layer)"]
            App1 --> DB1[Database Primary]
            App2 --> DB1
            DB1 --> DB2[Database Replica]
        end
    end
    
    style PublicTier fill:#c8e6c9
    style PrivateTier fill:#ffecb3
    style DataTier fill:#ffcdd2
```

## Subnet Troubleshooting

### **Common Issues**

1. **No Internet Access**
   - Check route table has IGW route (public) or NAT route (private)
   - Verify security group allows traffic
   - Confirm NACL permits traffic

2. **IP Address Exhaustion**
   - Monitor subnet utilization
   - Consider larger CIDR blocks
   - Clean up unused resources

3. **Cross-AZ Communication Issues**
   - Verify security groups allow inter-subnet traffic
   - Check NACL rules for cross-subnet communication
   - Confirm route tables have local VPC routes

### **Monitoring and Metrics**
- Use **VPC Flow Logs** to track subnet traffic
- Monitor **IP address utilization**
- Set up **CloudWatch alarms** for network metrics

## Summary

Subnets are fundamental building blocks of VPC architecture that provide:

- **Network segmentation** within your VPC
- **Availability Zone placement** for resources  
- **Traffic control** through routing and security
- **Scalable IP address management**
- **Security boundaries** for different application tiers

Proper subnet design is crucial for building secure, scalable, and highly available AWS architectures.