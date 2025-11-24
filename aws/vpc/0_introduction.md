# AWS VPC (Virtual Private Cloud) Explanation

## What is AWS VPC?

**AWS VPC** is a virtual network dedicated to your AWS account. It's logically isolated from other virtual networks in the AWS Cloud, giving you complete control over your virtual networking environment including:

- **IP address ranges** (CIDR blocks)
- **Subnets** creation
- **Route tables** configuration  
- **Network gateways** setup

Think of VPC as your own **private data center in the cloud** where you can launch AWS resources in a virtual network that you define.

## Core VPC Architecture Diagram

```mermaid
graph TB
    Internet[Internet]
    IGW[Internet Gateway<br/>IGW]
    
    subgraph VPC["AWS VPC (10.0.0.0/16)"]
        subgraph PublicSubnet["Public Subnet (10.0.1.0/24)"]
            WebServer[Web Server<br/>EC2 Instance<br/>10.0.1.10]
        end
        
        subgraph PrivateSubnet["Private Subnet (10.0.2.0/24)"]
            DBServer[Database Server<br/>EC2 Instance<br/>10.0.2.20]
            NAT[NAT Gateway]
        end
    end
    
    Internet --> IGW
    IGW --> WebServer
    WebServer --> DBServer
    NAT --> IGW
    DBServer --> NAT
    
    style VPC fill:#e1f5fe
    style PublicSubnet fill:#c8e6c9
    style PrivateSubnet fill:#ffecb3
    style Internet fill:#f3e5f5
```

## Key VPC Components

### 1. **Subnets**
- **Public Subnet**: Has direct route to Internet Gateway
- **Private Subnet**: No direct internet access, uses NAT for outbound traffic

### 2. **Internet Gateway (IGW)**
- Provides internet access to public subnets
- Horizontally scaled, redundant, and highly available

### 3. **NAT Gateway/Instance**
- Allows private subnet resources to access internet
- Prevents inbound internet connections

### 4. **Route Tables**
- Control traffic routing within VPC
- Each subnet must be associated with a route table

## VPC Security Layers Diagram

```mermaid
graph TB
    subgraph VPCSecurity["VPC Security Layers"]
        subgraph NACL["Network ACLs (Subnet Level)"]
            NACLRules["• Stateless<br/>• Allow/Deny Rules<br/>• Applied to Subnet"]
            
            subgraph SG["Security Groups (Instance Level)"]
                SGRules["• Stateful<br/>• Allow Rules Only<br/>• Applied to Instance"]
                
                subgraph Instance["EC2 Instance"]
                    App["Application<br/>Running"]
                end
            end
        end
    end
    
    Internet2[Internet Traffic] --> NACL
    NACL --> SG
    SG --> Instance
    
    style VPCSecurity fill:#e8f5e8
    style NACL fill:#fff3e0
    style SG fill:#e3f2fd
    style Instance fill:#f3e5f5
```

## Multi-AZ VPC Architecture

```mermaid
graph TB
    subgraph VPC2["VPC (10.0.0.0/16)"]
        subgraph AZ_A["Availability Zone A"]
            subgraph PubA["Public Subnet (10.0.1.0/24)"]
                WebA[Web Server A]
            end
            subgraph PrivA["Private Subnet (10.0.2.0/24)"]
                DBA[Database A]
            end
        end
        
        subgraph AZ_B["Availability Zone B"]
            subgraph PubB["Public Subnet (10.0.3.0/24)"]
                WebB[Web Server B]
            end
            subgraph PrivB["Private Subnet (10.0.4.0/24)"]
                DBB[Database B]
            end
        end
    end
    
    LoadBalancer[Application Load Balancer] --> WebA
    LoadBalancer --> WebB
    WebA --> DBA
    WebB --> DBB
    DBA -.-> DBB
    
    style VPC2 fill:#e1f5fe
    style AZ_A fill:#e8f5e8
    style AZ_B fill:#e8f5e8
    style PubA fill:#c8e6c9
    style PubB fill:#c8e6c9
    style PrivA fill:#ffecb3
    style PrivB fill:#ffecb3
```

## VPC Connectivity Options

### 1. **VPC Peering**

```mermaid
graph LR
    VPCA["VPC A<br/>10.0.0.0/16"] <--> PeeringConn["Peering<br/>Connection"] <--> VPCB["VPC B<br/>10.1.0.0/16"]
    
    style VPCA fill:#e1f5fe
    style VPCB fill:#e8f5e8
    style PeeringConn fill:#fff3e0
```

### 2. **VPN Gateway**

```mermaid
graph LR
    VPC3["AWS VPC"] <--> VPNTunnel["VPN Tunnel<br/>(Encrypted)"] <--> OnPrem["On-Premises<br/>Network"]
    
    style VPC3 fill:#e1f5fe
    style OnPrem fill:#f3e5f5
    style VPNTunnel fill:#ffecb3
```

### 3. **Direct Connect**

```mermaid
graph LR
    VPC4["AWS VPC"] <--> DX["Direct Connect<br/>(Dedicated Line)"] <--> OnPrem2["On-Premises<br/>Network"]
    
    style VPC4 fill:#e1f5fe
    style OnPrem2 fill:#f3e5f5
    style DX fill:#e8f5e8
```

## Common VPC Use Cases

### **1. Web Application Architecture**
- **Public subnet**: Web servers, load balancers
- **Private subnet**: Application servers, databases
- **Security**: Multi-layered protection

### **2. Hybrid Cloud Setup**
- Connect on-premises infrastructure to AWS
- Extend existing network to cloud
- Maintain consistent security policies

### **3. Multi-Tier Applications**
- **Presentation tier**: Public subnet
- **Application tier**: Private subnet  
- **Database tier**: Private subnet with restricted access

## Practical Example: Internet Access Flow

### Scenario: User accessing www.pranavbhat.com

```mermaid
sequenceDiagram
    participant User as Internet User
    participant DNS as Route 53 DNS
    participant IGW as Internet Gateway
    participant Web as Web Server<br/>(10.0.1.10)
    participant DB as Database Server<br/>(10.0.2.20)
    
    User->>DNS: 1. Request www.pranavbhat.com
    DNS->>User: 2. Returns 54.123.45.67 (Elastic IP)
    User->>IGW: 3. HTTP Request to 54.123.45.67
    IGW->>Web: 4. Routes to 10.0.1.10 (Private IP)
    Web->>DB: 5. Query database (internal VPC)
    DB->>Web: 6. Return data
    Web->>IGW: 7. HTTP Response
    IGW->>User: 8. Response via public IP
    
    Note over User,DB: Traffic Flow: Internet → VPC → Internal Communication
```

```mermaid
graph TB
    User[Internet User<br/>www.pranavbhat.com]
    DNS[Route 53 DNS<br/>Returns: 54.123.45.67]
    
    subgraph VPC5["AWS VPC (10.0.0.0/16)"]
        IGW2[Internet Gateway<br/>Entry Point]
        
        subgraph PublicSub["Public Subnet (10.0.1.0/24)"]
            WebSrv[Web Server EC2<br/>Private: 10.0.1.10<br/>Public: 54.123.45.67]
        end
        
        subgraph PrivateSub["Private Subnet (10.0.2.0/24)"]
            DBSrv[Database Server<br/>Private: 10.0.2.20<br/>No Public IP]
        end
    end
    
    User --> DNS
    DNS --> IGW2
    IGW2 --> WebSrv
    WebSrv --> DBSrv
    
    style VPC5 fill:#e1f5fe
    style PublicSub fill:#c8e6c9
    style PrivateSub fill:#ffecb3
    style User fill:#f3e5f5
    style DNS fill:#fff3e0
```

### Step-by-Step Traffic Flow:

**1. DNS Resolution**
```
User types: www.pranavbhat.com
Route 53 DNS responds: 54.123.45.67 (Elastic IP)
```

**2. Internet Gateway Processing**
```
Request: Internet → IGW → VPC
- IGW receives traffic destined for 54.123.45.67
- IGW translates public IP to private IP (10.0.1.10)
- Routes traffic to correct subnet based on route table
```

**3. Route Table Decision**
```
Destination: 10.0.1.10
Route Table Entry: 10.0.1.0/24 → Local (Public Subnet)
Action: Forward to Public Subnet
```

**4. Security Group Check**
```
Inbound Rules for Web Server:
- HTTP (Port 80): 0.0.0.0/0 ✅ ALLOW
- HTTPS (Port 443): 0.0.0.0/0 ✅ ALLOW
- SSH (Port 22): 203.0.113.0/24 ✅ ALLOW (Admin IP only)
```

**5. Web Server Processing**
```
EC2 Instance (10.0.1.10) receives request:
- Processes HTTP/HTTPS request
- May need to query database in private subnet
- Generates response
```

**6. Database Communication (Internal)**
```
Web Server → Database Server:
- Source: 10.0.1.10 (Public Subnet)
- Destination: 10.0.2.20 (Private Subnet)
- Route: Local VPC routing (no IGW needed)
- Security Group: Allow MySQL (3306) from web servers only
```

**7. Response Flow**
```
Database → Web Server → IGW → Internet → User
- Response follows reverse path
- IGW translates private IP back to public IP
- User receives website content
```

### Security Layers in Action:

**Network ACL (Subnet Level)**
```
Public Subnet NACL:
- Inbound: HTTP/HTTPS from 0.0.0.0/0 ✅
- Outbound: All traffic ✅

Private Subnet NACL:
- Inbound: MySQL from 10.0.1.0/24 ✅
- Outbound: MySQL responses ✅
```

**Security Groups (Instance Level)**
```
Web Server SG:
- Inbound: Port 80,443 from 0.0.0.0/0
- Outbound: Port 3306 to Database SG

Database Server SG:
- Inbound: Port 3306 from Web Server SG only
- Outbound: Responses to Web Server SG
```

## Best Practices

- **Use multiple AZs** for high availability
- **Implement least privilege** access with security groups
- **Monitor traffic** with VPC Flow Logs
- **Plan CIDR blocks** carefully to avoid conflicts
- **Use private subnets** for sensitive resources