# n8n Documentation Reference

Official n8n Documentation: https://docs.n8n.io/

## Getting Started

- **Installation & Setup**: https://docs.n8n.io/installation/
- **Quick Start Guide**: https://docs.n8n.io/quickstart/
- **User Guide**: https://docs.n8n.io/user-guide/

## Workflow Building

- **Creating Workflows**: https://docs.n8n.io/user-guide/workflows/
- **Nodes & Connections**: https://docs.n8n.io/user-guide/nodes/
- **Triggers**: https://docs.n8n.io/user-guide/workflows/triggers/
- **Data Types**: https://docs.n8n.io/user-guide/data-types/

## Node Integrations

### Authentication Nodes
- **HTTP Request Node**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
- **Authentication Methods**: https://docs.n8n.io/user-guide/authentication/

### Database Nodes
- **PostgreSQL**: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.postgres/
- **SQL Nodes**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.sql/

### API & Webhook Nodes
- **Webhook Node**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
- **REST API**: https://docs.n8n.io/user-guide/webhooks/

### Email & Communication
- **Gmail**: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.gmail/
- **Email Trigger**: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.emailtrigger/

### AI & Automation
- **OpenAI (GPT)**: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.openai/
- **AI Workflow Builder**: https://docs.n8n.io/user-guide/ai-features/ai-workflow-builder/

### Web Tools
- **HTTP Request**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
- **Webscraper**: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.webscraper/

## Control Flow

- **IF Node (Conditional Logic)**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if/
- **Switch Node (Multiple Conditions)**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch/
- **Loop Node (Iterate Data)**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.loop/
- **Merge Node (Combine Data)**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.merge/

## Data Manipulation

- **Function Node**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.function/
- **JavaScript Code**: https://docs.n8n.io/user-guide/expressions/
- **Data Transformer**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.itemlists/
- **JSON Processing**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.jsonextract/

## Expressions & Templating

- **Expression Editor**: https://docs.n8n.io/user-guide/expressions/
- **Variables & Data Access**: https://docs.n8n.io/user-guide/expressions/variables-data/
- **Built-in Functions**: https://docs.n8n.io/user-guide/expressions/functions/

## Advanced Topics

- **Error Handling**: https://docs.n8n.io/user-guide/workflows/error-handling/
- **Retry & Resume**: https://docs.n8n.io/user-guide/workflows/error-handling/#retry
- **Scheduling Workflows**: https://docs.n8n.io/user-guide/workflows/scheduling/
- **Webhooks & Incoming Data**: https://docs.n8n.io/user-guide/webhooks/

## Deployment & Operations

- **Self-Hosted Installation**: https://docs.n8n.io/installation/
- **Docker Setup**: https://docs.n8n.io/installation/docker/
- **Database Connection**: https://docs.n8n.io/user-guide/data/database/
- **Credentials Management**: https://docs.n8n.io/user-guide/credentials/

## Community & Support

- **n8n Community**: https://community.n8n.io/
- **GitHub Repository**: https://github.com/n8n-io/n8n
- **Release Notes**: https://docs.n8n.io/release-notes/
- **Blog & Tutorials**: https://blog.n8n.io/

## API Reference

- **REST API Docs**: https://docs.n8n.io/api/
- **GraphQL API**: https://docs.n8n.io/user-guide/api/

## Workflows in This Project

### 1. Authentication Workflow
**Related Docs**:
- HTTP Request: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
- Webhook Triggers: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/

### 2. Job Analyzer Workflow
**Related Docs**:
- OpenAI Integration: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.openai/
- HTTP Request: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
- Conditional Logic (IF): https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if/

### 3. CV Generator Workflow
**Related Docs**:
- OpenAI Integration: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.openai/
- HTTP Request: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/

### 4. Application Sender Workflow
**Related Docs**:
- Gmail Integration: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.gmail/
- PostgreSQL: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.postgres/
- Data Merging: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.merge/

### 5. Job Scraping Workflow
**Related Docs**:
- HTTP Request: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
- Web Scraping: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.webscraper/
- Data Extraction: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.jsonextract/

## Latest n8n Version (2025)

- Current Release: https://docs.n8n.io/release-notes/
- Version Info: Check the official docs for latest features
- AI Workflow Builder: New feature in 2025 to generate workflows from prompts
- Performance Improvements: Latest versions include improved HTTP and AI nodes

## Quick Tips

1. **Test Workflows**: Use the "Test" button in n8n editor before deploying
2. **Use Credentials**: Store API keys in n8n credentials, not hardcoded in workflows
3. **Error Handling**: Always add error handling nodes for production workflows
4. **Monitoring**: Use webhook responses to monitor workflow success/failure
5. **Documentation**: Reference the official docs for node-specific syntax and parameters

