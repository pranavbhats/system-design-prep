# AWS VPC Route Tables

## What is a Route Table?

A **Route Table** is a set of rules (called routes) that determines where network traffic from your subnet or gateway is directed. Think of it as a **GPS for your network traffic** - it tells packets which path to take to reach their destination.

## Key Route Table Concepts

### **Routes**
- Each route specifies a **destination** (CIDR block) and a **target** (where to send traffic)
- Routes are evaluated in order of **most specific to least specific**
- **Longest prefix match** wins when multiple routes could apply

### **Route Priority**
1. **Local routes** (VPC CIDR) - highest priority
2. **Most specific routes** (smaller CIDR blocks)
3. **Least specific routes** (larger CIDR blocks)
4. **Default route** (0.0.0.0/0) - lowest priority

## Route Table Architecture

```mermaid
graph TB
    subgraph VPC["VPC (10.0.0.0/16)"]
        subgraph PublicSubnet["Public Subnet (10.0.1.0/24)"]
            WebServer["Web Server<br/>10.0.1.10"]
        end
        
        subgraph PrivateSubnet["Private Subnet (10.0.2.0/24)"]
            AppServer["App Server<br/>10.0.2.10"]
        end
        
        subgraph RouteTableSection["Route Tables"]
            subgraph PublicRT["Public Route Table"]
                PubRoute1["10.0.0.0/16 → Local"]
                PubRoute2["0.0.0.0/0 → IGW"]
            end
            
            subgraph PrivateRT["Private Route Table"]
                PrivRoute1["10.0.0.0/16 → Local"]
                PrivRoute2["0.0.0.0/0 → NAT Gateway"]
            end
        end
        
        IGW["Internet Gateway"]
        NAT["NAT Gateway"]
    end
    
    Internet["Internet"]
    
    PublicSubnet -.-> PublicRT
    PrivateSubnet -.-> PrivateRT
    
    Internet --> IGW
    IGW --> WebServer
    WebServer --> AppServer
    AppServer --> NAT
    NAT --> IGW
    
    style VPC fill:#e1f5fe
    style PublicSubnet fill:#c8e6c9
    style PrivateSubnet fill:#ffecb3
    style PublicRT fill:#e8f5e8
    style PrivateRT fill:#fff3e0
```

## Route Table Types

### 1. **Main Route Table**
- **Default route table** created with every VPC
- **Automatically associated** with subnets that don't have explicit associations
- **Cannot be deleted** but can be modified

### 2. **Custom Route Tables**
- **User-created** route tables for specific requirements
- **Explicitly associated** with subnets
- **Can be deleted** when no longer needed

### 3. **Gateway Route Tables**
- Associated with **Internet Gateways** or **Virtual Private Gateways**
- Controls traffic **entering the VPC**
- Used for **advanced routing scenarios**

## Route Table Components

```mermaid
graph LR
    subgraph RouteTable["Route Table Structure"]
        subgraph Routes["Routes"]
            Route1["Destination: 10.0.0.0/16<br/>Target: Local<br/>Status: Active"]
            Route2["Destination: 0.0.0.0/0<br/>Target: igw-12345<br/>Status: Active"]
            Route3["Destination: 192.168.0.0/16<br/>Target: vgw-67890<br/>Status: Active"]
        end
        
        subgraph Associations["Subnet Associations"]
            Assoc1["subnet-abc123"]
            Assoc2["subnet-def456"]
        end
        
        subgraph Propagation["Route Propagation"]
            Prop1["VPN Gateway"]
            Prop2["Direct Connect Gateway"]
        end
    end
    
    Routes --> Associations
    Propagation --> Routes
    
    style Routes fill:#e8f5e8
    style Associations fill:#c8e6c9
    style Propagation fill:#ffecb3
```

## Common Route Patterns

### **Public Subnet Route Table**

```mermaid
graph TB
    subgraph PublicRouteTable["Public Route Table"]
        subgraph Routes1["Routes"]
            LocalRoute["10.0.0.0/16 → Local<br/>(VPC Communication)"]
            InternetRoute["0.0.0.0/0 → IGW<br/>(Internet Access)"]
        end
    end
    
    subgraph Traffic["Traffic Examples"]
        Internal["10.0.2.5 → Local Route"]
        External["8.8.8.8 → Internet Route"]
        Specific["10.0.1.100 → Local Route"]
    end
    
    Traffic --> Routes1
    
    style PublicRouteTable fill:#c8e6c9
    style Routes1 fill:#e8f5e8
```

### **Private Subnet Route Table**

```mermaid
graph TB
    subgraph PrivateRouteTable["Private Route Table"]
        subgraph Routes2["Routes"]
            LocalRoute2["10.0.0.0/16 → Local<br/>(VPC Communication)"]
            NATRoute["0.0.0.0/0 → NAT Gateway<br/>(Outbound Internet)"]
        end
    end
    
    subgraph Traffic2["Traffic Examples"]
        Internal2["10.0.1.5 → Local Route"]
        External2["8.8.8.8 → NAT Route"]
        Update["yum update → NAT Route"]
    end
    
    Traffic2 --> Routes2
    
    style PrivateRouteTable fill:#ffecb3
    style Routes2 fill:#e8f5e8
```

### **Isolated Subnet Route Table**

```mermaid
graph TB
    subgraph IsolatedRouteTable["Isolated Route Table"]
        subgraph Routes3["Routes"]
            LocalRoute3["10.0.0.0/16 → Local<br/>(VPC Only)"]
            NoInternet["No Internet Route<br/>(Completely Isolated)"]
        end
    end
    
    subgraph Traffic3["Traffic Examples"]
        Internal3["10.0.1.5 → Local Route"]
        Blocked["8.8.8.8 → No Route (Dropped)"]
        Database["Database Replication → Local"]
    end
    
    Traffic3 --> Routes3
    
    style IsolatedRouteTable fill:#ffcdd2
    style Routes3 fill:#e8f5e8
```

## Route Resolution Process

```mermaid
sequenceDiagram
    participant Source as Source Instance
    participant RT as Route Table
    participant Target as Target
    
    Source->>RT: 1. Packet to 8.8.8.8
    RT->>RT: 2. Check Local Route (10.0.0.0/16)
    Note over RT: No match - not local traffic
    RT->>RT: 3. Check Specific Routes
    Note over RT: No specific matches found
    RT->>RT: 4. Check Default Route (0.0.0.0/0)
    Note over RT: Match found - use IGW/NAT
    RT->>Target: 5. Forward to Internet Gateway
    Target->>Source: 6. Response via same path
    
    Note over Source,Target: Longest Prefix Match Algorithm
```

## Advanced Routing Scenarios

### **VPC Peering Routes**

```mermaid
graph LR
    subgraph VPC_A["VPC A (10.0.0.0/16)"]
        SubnetA["Subnet A<br/>10.0.1.0/24"]
        RouteTableA["Route Table A<br/>10.1.0.0/16 → pcx-123"]
    end
    
    subgraph VPC_B["VPC B (10.1.0.0/16)"]
        SubnetB["Subnet B<br/>10.1.1.0/24"]
        RouteTableB["Route Table B<br/>10.0.0.0/16 → pcx-123"]
    end
    
    PeeringConnection["VPC Peering<br/>Connection<br/>pcx-123"]
    
    SubnetA -.-> RouteTableA
    SubnetB -.-> RouteTableB
    RouteTableA --> PeeringConnection
    RouteTableB --> PeeringConnection
    
    style VPC_A fill:#e1f5fe
    style VPC_B fill:#e8f5e8
    style PeeringConnection fill:#fff3e0
```

### **VPN Connection Routes**

```mermaid
graph TB
    subgraph AWS["AWS VPC (10.0.0.0/16)"]
        subgraph PrivateSubnetVPN["Private Subnet"]
            ServerAWS["Server<br/>10.0.1.10"]
        end
        
        subgraph RouteTableVPN["Route Table"]
            LocalRouteVPN["10.0.0.0/16 → Local"]
            OnPremRoute["192.168.0.0/16 → VGW"]
            InternetRouteVPN["0.0.0.0/0 → NAT"]
        end
        
        VGW["Virtual Private<br/>Gateway"]
    end
    
    subgraph OnPremises["On-Premises (192.168.0.0/16)"]
        ServerOnPrem["Server<br/>192.168.1.10"]
        CustomerGW["Customer<br/>Gateway"]
    end
    
    VPNTunnel["VPN Tunnel<br/>(Encrypted)"]
    
    PrivateSubnetVPN -.-> RouteTableVPN
    RouteTableVPN --> VGW
    VGW --> VPNTunnel
    VPNTunnel --> CustomerGW
    CustomerGW --> ServerOnPrem
    
    style AWS fill:#e1f5fe
    style OnPremises fill:#f3e5f5
    style VPNTunnel fill:#ffecb3
```

## Route Propagation

### **Automatic Route Learning**

```mermaid
graph TB
    subgraph VPC["VPC"]
        subgraph RouteTableProp["Route Table"]
            StaticRoutes["Static Routes<br/>10.0.0.0/16 → Local<br/>0.0.0.0/0 → IGW"]
            PropagatedRoutes["Propagated Routes<br/>192.168.1.0/24 → VGW<br/>192.168.2.0/24 → VGW"]
        end
        
        VGW2["Virtual Private Gateway<br/>(Route Propagation Enabled)"]
    end
    
    subgraph OnPrem["On-Premises Networks"]
        Network1["Network 1<br/>192.168.1.0/24"]
        Network2["Network 2<br/>192.168.2.0/24"]
    end
    
    VGW2 -.->|"Automatically<br/>Propagates Routes"| PropagatedRoutes
    VGW2 --> Network1
    VGW2 --> Network2
    
    style StaticRoutes fill:#c8e6c9
    style PropagatedRoutes fill:#ffecb3
    style VGW2 fill:#e1f5fe
```

## Route Table Best Practices

### **1. Naming and Organization**
- Use **descriptive names** (e.g., "Public-RT-Web", "Private-RT-App")
- **Tag route tables** with environment, purpose, and owner
- **Document route purposes** in descriptions

### **2. Security Considerations**
- **Principle of least privilege** - only necessary routes
- **Avoid overly broad routes** (0.0.0.0/0 to wrong targets)
- **Regular route audits** for unused or incorrect routes

### **3. High Availability**
- **Multiple AZ routing** for redundancy
- **NAT Gateway per AZ** for private subnets
- **Monitor route table health** and dependencies

### **4. Route Management**
- **Separate route tables** for different tiers
- **Use route propagation** for dynamic environments
- **Version control** route table changes

## Troubleshooting Route Tables

### **Common Issues**

```mermaid
graph TB
    subgraph Issues["Common Route Table Issues"]
        Issue1["No Internet Access<br/>Missing 0.0.0.0/0 route"]
        Issue2["Wrong Target<br/>Route points to inactive gateway"]
        Issue3["Route Conflicts<br/>Overlapping CIDR blocks"]
        Issue4["Missing Local Routes<br/>VPC communication broken"]
    end
    
    subgraph Solutions["Troubleshooting Steps"]
        Step1["1. Check route table associations"]
        Step2["2. Verify route targets are active"]
        Step3["3. Test with most specific routes"]
        Step4["4. Use VPC Flow Logs"]
    end
    
    Issues --> Solutions
    
    style Issues fill:#ffcdd2
    style Solutions fill:#c8e6c9
```

### **Diagnostic Commands**

```bash
# Check route table associations
aws ec2 describe-route-tables --route-table-ids rtb-12345678

# Verify subnet associations
aws ec2 describe-subnets --subnet-ids subnet-12345678

# Test connectivity
ping 8.8.8.8
traceroute 8.8.8.8

# Check security groups and NACLs
aws ec2 describe-security-groups --group-ids sg-12345678
```

## Route Table Limits

### **AWS Limits**
- **200 route tables** per VPC
- **50 routes** per route table
- **1 route table** per subnet association
- **Propagated routes** count toward the 50-route limit

### **Performance Considerations**
- **Route lookup** is very fast (hardware-accelerated)
- **More specific routes** are preferred
- **Route changes** take effect immediately

## Summary

Route Tables are the **traffic control system** of your VPC:

- **Direct network traffic** based on destination IP
- **Enable internet access** through IGW routes
- **Provide VPC connectivity** through local routes
- **Support hybrid connectivity** via VPN/Direct Connect
- **Operate at subnet level** with automatic association
- **Use longest prefix matching** for route selection

Proper route table design is essential for **secure, efficient, and reliable** network connectivity in AWS VPC environments.