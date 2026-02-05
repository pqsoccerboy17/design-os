# Building a Solo Consultant's Open Source Framework

A complete technology stack for managing multi-stakeholder consulting engagements exists using mature, well-maintained open source tools—no enterprise software licenses required. For a non-developer managing 12 stakeholders across 5 regions with Docker and n8n already available, the optimal approach combines **Plane** for engagement management, **Activepieces** for AI-powered automation with MCP support, and **Evidence.dev** or **Metabase** for executive dashboards. Eigent AI, while promising, remains too immature for production client work.

The recommended stack balances capability with manageability: every tool uses Docker, has 5,000+ GitHub stars, and offers visual interfaces rather than code-heavy configuration. Total infrastructure cost runs $20-40/month on a modest VPS—a fraction of equivalent SaaS subscriptions.

---

## The case against Eigent AI (for now)

Eigent AI (github.com/eigent-ai/eigent) is a desktop application for multi-agent AI orchestration built on CAMEL-AI's framework. It offers impressive capabilities: parallel agent execution, native MCP tools integration for Notion/Google Suite/Slack, and 100% local deployment for client data privacy. The free tier includes 1,000 credits plus 200 daily refresh—generous for experimentation.

However, **three factors disqualify it for production client work**:

- **Beta status** with limited community validation and potential reliability issues
- **Desktop-only architecture** that can't run as a persistent server for automation
- **No direct n8n integration**, requiring webhook bridges for workflow orchestration

For the EasyVista engagement with its March 31 deadline and executive stakeholders, betting on beta software creates unnecessary risk. **Better alternatives exist** that are production-proven and integrate directly with existing tools.

---

## AI agent orchestration that actually works in production

The AI agent ecosystem has matured significantly. Three frameworks stand out for solo consultants balancing capability with manageability:

**n8n's native AI Agent nodes** (150K+ stars) represent the most practical choice. Since the user already runs n8n, adding AI capabilities requires only enabling existing nodes. n8n's LangChain-based agents connect to 400+ integrations—Notion, Google Drive, Slack are all native. The self-hosted AI Starter Kit provides production-ready deployment patterns.

**Flowise** (12K+ stars) excels as a visual companion to n8n. Its drag-and-drop builder creates LLM applications without code: `docker run -d -p 3000:3000 flowiseai/flowise`. Flowise handles the AI complexity while n8n manages workflow orchestration. The LLemonStack project (github.com/LLemonStack/llemonstack) provides a pre-configured Docker stack combining both tools.

**CrewAI** (33K+ stars) offers role-based multi-agent orchestration when workflows become complex enough to warrant it. Agents act like team members with defined responsibilities—useful for scenarios like "research agent gathers data, analysis agent interprets it, writer agent drafts the report." Python-based but well-documented with YAML configuration support.

| Framework | Stars | Setup Ease | MCP Support | n8n Integration | Best For |
|-----------|-------|------------|-------------|-----------------|----------|
| n8n AI nodes | 150K+ | ⭐⭐⭐⭐⭐ | Native | Native | Already-running n8n deployments |
| Flowise | 12K+ | ⭐⭐⭐⭐⭐ | Via LangChain | Excellent | Visual AI workflow building |
| CrewAI | 33K+ | ⭐⭐⭐⭐ | Custom | Webhooks | Complex multi-agent scenarios |
| LangGraph | 23.6K | ⭐⭐ | Native | Native | Enterprise workflows requiring precise control |

---

## Consulting engagement management without the enterprise price tag

Managing 12 stakeholders across 5 regions requires proper tooling. Three open source tools cover the essential consulting workflows—all Docker-native and designed for non-technical users.

**Plane** (github.com/makeplane/plane, **42,600 stars**) serves as the engagement management hub. This modern Jira alternative provides issues, sprints, roadmaps, and custom properties for stakeholder tracking. Custom fields can capture region, workstream (Dripify vs. Loopio), stakeholder influence level, and engagement status. Setup takes five minutes:

```bash
git clone --depth 1 -b master https://github.com/makeplane/plane.git && cd plane
./setup.sh localhost
docker-compose up -d
```

**BookStack** (github.com/BookStackApp/BookStack, **16,300 stars**) organizes methodology documentation with a Book→Chapter→Page hierarchy. Create books for "Discovery Methodology," "Assessment Frameworks," and "EasyVista Engagement," each containing structured knowledge. The WYSIWYG editor with Draw.io integration makes creating stakeholder maps and process diagrams straightforward. MIT licensed, runs on a $5/month VPS.

**Formbricks** (github.com/formbricks/formbricks, **11,500 stars**) handles client intake and assessment questionnaires. Its conditional logic creates dynamic discovery questionnaires that branch based on responses—essential for scoping engagements across different stakeholder perspectives. Export data to CSV for import into Plane or analysis in dashboards.

For the EasyVista test case specifically:
- Create 5 modules in Plane representing each region
- Track 12 stakeholders using custom fields with properties (influence, workstream, communication preference)
- Build discovery questionnaires in Formbricks for each workstream
- Document the Dripify and Loopio assessment methodologies in BookStack

---

## Activepieces bridges n8n with the MCP ecosystem

The user's existing n8n deployment handles workflow automation well, but adding **Activepieces** (github.com/activepieces/activepieces, **19,200 stars**) unlocks a critical capability: **280+ MCP servers auto-generated from its integration pieces**.

Every Activepieces connector automatically becomes an MCP server usable with Claude Desktop, Cursor, or any MCP-compatible AI tool. This transforms the consulting stack into an AI-queryable system where Claude can directly access Notion databases, trigger Slack messages, or pull Google Drive documents through structured MCP protocols.

Activepieces rated **9.1 vs. n8n's 7.7 on G2 for ease of setup**—a meaningful difference for non-developers. Its drag-and-drop editor is more intuitive than n8n's, with built-in debugging and clear step naming. Setup is trivial:

```bash
docker compose up -d
# Access at localhost:8080
```

The two tools complement rather than replace each other:
- **n8n** handles complex multi-step workflows with its mature node ecosystem
- **Activepieces** provides the MCP bridge and handles simpler automations with its friendlier interface
- Both communicate via webhooks when needed

For data pipelines syncing client information across systems, avoid Apache Airflow or Dagster—both require significant Python expertise. Instead, use n8n's native database and API nodes for ETL workflows between Notion, Google Sheets, and your PostgreSQL-backed tools.

---

## Executive dashboards without the infrastructure burden

Client-facing dashboards for PE-backed executives demand polished, professional presentation. Two paths work well depending on technical comfort:

**Evidence.dev** (github.com/evidence-dev/evidence, **5,600 stars**) generates executive reports from SQL queries and Markdown. Write `SELECT * FROM stakeholder_status WHERE region = 'EMEA'`, wrap it in Markdown, and Evidence produces interactive charts with professional styling. The output deploys as a static site to **GitHub Pages, Netlify, or Vercel—all free**.

This approach works exceptionally well for consulting:
- Version control through Git provides audit trails PE clients expect
- No infrastructure to manage—dashboards are static files
- Build pipelines trigger rebuilds when data changes via webhooks
- Full control over design and branding

**Metabase** (github.com/metabase/metabase, **45,000 stars**) suits consultants wanting zero-code setup. Its visual query builder requires no SQL knowledge—point, click, and drag to create dashboards. The natural language "Ask a Question" feature lets you type "show me stakeholder engagement by region this month" and receive a chart. Five-minute Docker setup:

```bash
docker run -d -p 3000:3000 --name metabase metabase/metabase
```

Metabase's embedded analytics support white-labeling, so client portals show your branding rather than Metabase's. The tradeoff: requires a running server rather than static hosting.

| Tool | Stars | GitHub Pages | Non-Dev Friendly | Best For |
|------|-------|--------------|------------------|----------|
| Evidence.dev | 5.6K | ✅ Yes | ⭐⭐⭐ | SQL-proficient consultants wanting Git workflows |
| Metabase | 45K | ❌ No | ⭐⭐⭐⭐⭐ | Visual dashboards without code |
| Astro + Notion | 50K+ | ✅ Yes | ⭐⭐ | Full design control with Notion as CMS |
| Grafana | 70K | ❌ No | ⭐⭐⭐ | Monitoring and time-series data |

**For the EasyVista engagement**: Metabase connects directly to Plane's PostgreSQL database, enabling real-time dashboards showing workstream progress, stakeholder engagement status, and risk register summaries—exactly what PE executives expect in steering committee presentations.

---

## How Astro handles dynamic Notion data

Astro (github.com/withastro/astro, **50K+ stars**) can pull Notion data for client portals, but with important caveats. The `@notionhq/client` SDK fetches data at **build time**, meaning content becomes static until the next build. For truly dynamic displays:

1. Configure n8n or Activepieces webhooks to trigger Astro rebuilds when Notion databases change
2. Use React components with client-side JavaScript for real-time data fetching
3. Deploy to Netlify or Vercel for automatic rebuild triggers

The `astro-notion-blog` starter (github.com/otoyo/astro-notion-blog) provides a working template. For most consulting use cases, scheduled rebuilds every few hours provide sufficient freshness without complexity.

---

## The recommended stack for your EasyVista engagement

Based on the technical context (non-developer, Docker available, n8n running, March 31 deadline), here's the specific architecture:

**Core Stack (Priority Order):**

| Layer | Tool | Purpose | Setup Time |
|-------|------|---------|------------|
| Engagement Management | Plane | Stakeholder tracking, workstream management | 30 min |
| Automation + MCP | Activepieces | AI integration, MCP servers for Claude | 15 min |
| Knowledge Base | BookStack | Methodology docs, engagement wikis | 20 min |
| Client Intake | Formbricks | Discovery questionnaires, assessments | 20 min |
| Dashboards | Metabase | Executive reporting, progress tracking | 15 min |

**Infrastructure Requirements:**
- 4 vCPU, 8GB RAM VPS (DigitalOcean/Hetzner: $24-48/month)
- Docker and Docker Compose pre-installed
- Caddy or Traefik as reverse proxy for HTTPS

**Integration Architecture:**

```
Formbricks (intake) → n8n webhook → Plane (creates stakeholder issues)
                                  ↘ BookStack (generates engagement wiki)
                                  ↘ Metabase (populates dashboard)

Activepieces (MCP) ← Claude Desktop queries → Live engagement data
```

For the specific EasyVista scenario:
1. **5 Plane modules** for EMEA, APAC, Americas, UK&I, and Global stakeholders
2. **2 BookStack books** documenting Dripify (LinkedIn automation) and Loopio (RFP standardization) methodologies
3. **Formbricks surveys** for each stakeholder capturing pain points, success metrics, and change readiness
4. **Metabase dashboard** showing 12-stakeholder engagement matrix, workstream progress, and risk status

---

## Security posture of recommended tools

All recommended tools meet reasonable security standards for consulting work:

| Tool | License | Data Location | Auth Options | Security Notes |
|------|---------|---------------|--------------|----------------|
| Plane | AGPL-3.0 | Self-hosted | OAuth, LDAP | Active security updates |
| BookStack | MIT | Self-hosted | OAuth, SAML, LDAP | No major CVEs in past year |
| Formbricks | AGPL-3.0 | Self-hosted | OAuth | HTTPS enforced by default |
| Activepieces | MIT | Self-hosted | OAuth | Encrypted credentials storage |
| Metabase | AGPL | Self-hosted | LDAP, SSO | Enterprise-grade option available |

**Key security practices:**
- Deploy behind HTTPS reverse proxy (Caddy auto-configures certificates)
- Enable authentication immediately after setup
- Regular `docker pull` for security patches
- Backup PostgreSQL volumes daily (all tools use PostgreSQL)

---

## Conclusion

The consulting framework puzzle solves cleanly with mature open source tools. **Plane, BookStack, and Formbricks** handle engagement mechanics. **n8n plus Activepieces** provide automation with AI capabilities and MCP integration for Claude. **Metabase** delivers executive-ready dashboards. Total cost stays under $50/month including hosting.

Skip Eigent AI until it exits beta—n8n's native AI nodes plus Flowise accomplish the same goals with production-grade reliability. For GitHub Pages-hosted client portals, Evidence.dev offers SQL-to-dashboard simplicity, while Astro with Notion provides full design control.

The EasyVista engagement serves as an ideal test case: 12 stakeholders across 5 regions tracked in Plane modules, dual workstream methodologies documented in BookStack, intake captured through Formbricks, and progress visible to PE executives via Metabase dashboards—all self-hosted, fully controlled, and ready for the March 31 deadline.