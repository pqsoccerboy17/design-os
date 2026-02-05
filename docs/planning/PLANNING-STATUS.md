# Consulting Framework - Planning Status
**Date:** 2026-01-22
**Session:** Initial Architecture Planning
**Status:** Planning complete, awaiting revision based on gap analysis

---

## CRITICAL DECISIONS MADE

### Architecture Philosophy

**✅ MCP Servers vs. n8n - Keep Separate**
- MCP servers = Claude's hands (AI-queryable tools)
- n8n = Background automation (scheduled workflows)
- Do NOT consolidate - they serve different purposes

**✅ AI Vendor Lock-In Prevention**
- Build LLM-agnostic architecture
- Multi-layer: Interface (swappable) → Business Logic (vendor-agnostic) → Data (portable)
- Business logic in Python, NOT in prompts
- Every tool exposed as: MCP + REST API + CLI (future)
- Data in portable formats (SQLite, JSON, CSV)

**✅ Monarch MCP Reliability Fix**
- Move from live API calls to local-first data
- Manual CSV export from Monarch Money → SQLite
- n8n automates import (daily at 2am)
- Query local data (fast, reliable, offline-capable)

**✅ Claude as Primary Interface**
1. Primary: Claude Desktop/Code (MCP protocol)
2. Secondary: Notion (visual workspace, client sharing)
3. Tertiary: client-timelines GitHub Pages (executive dashboards)

### Tool Stack

**✅ MUST-HAVE:**
- consulting-framework-mcp (NEW - purpose-built)
- Notion (enhance existing YourCo workspace)
- client-timelines (enhance existing, keep isolated for now)
- n8n (leverage existing Docker container)
- SQLite (standard pattern)

**❌ SKIP (Avoiding Tool Sprawl):**
- Plane (redundant with Notion)
- BookStack (Notion handles docs)
- Formbricks (Notion forms work)
- Metabase (static dashboards better)
- Activepieces (already have 10+ custom MCPs)
- Evidence.dev (Python generator simpler)

### Data Architecture

**✅ Single SQLite Database with Logical Isolation**
- `engagement_id` is isolation boundary
- All queries scoped by engagement_id
- Credentials per-client in OS keyring
- Option to split to per-client DBs later if needed

**✅ Core Tables (9 total):**
- clients, engagements, stakeholders
- workstreams, workstream_phases, workstream_tasks
- discovery_questionnaires, discovery_responses
- deliverables, audit_log, sync_state
- financial_transactions, financial_accounts (for Monarch data)

### Home Hub

**✅ Notion "Command Center" Page**
- Active engagements database view
- Dashboard links (GitHub Pages)
- Methodology library
- System status
- Documentation wiki

**✅ Documentation Strategy (4 Tiers):**
1. CLAUDE.md files (per repo)
2. Auto-generated MCP docs (from docstrings)
3. Notion Wiki (living docs, auto-synced)
4. Interactive query via Claude (ask about architecture)

---

## PROPOSED IMPLEMENTATION TIMELINE

### Phase 1: MVP for EasyVista (Weeks 1-3, by Feb 14)
**Goal:** Build tools to support EasyVista engagement

**Week 1: Foundation**
- Create consulting-framework-mcp repo
- Implement SQLite schema
- Build core tools: create_engagement, add_stakeholder, update_workstream_progress
- Set up audit logging
- Basic Notion export

**Week 2: EasyVista Integration**
- Import existing client-timelines data into SQLite
- Implement bidirectional sync (consulting-framework-mcp ↔ client-timelines)
- Notion ↔ consulting-framework-mcp sync
- n8n workflow for daily syncs
- Dashboard enhancements

**Week 3: Discovery, Documentation & Polish**
- Discovery questionnaire templates
- Response tracking
- Executive summary generation
- Mobile-responsive dashboard
- Notion Command Center page
- Complete documentation system

**Success Criteria:**
- All 12 EasyVista stakeholders tracked
- 2 workstreams with phase-level progress
- Dashboard accessible to Evan (COO)
- Discovery responses captured for 8+ stakeholders
- Ready for March 31 delivery

### Phase 2: Extract Reusable Framework (Weeks 4-5, by Mar 1)
- Multi-client support (test with Tap)
- Methodology template library
- Client onboarding automation
- Framework documentation

### Phase 3: Full Platform (Weeks 6-8, Apr 1-15)
- Cross-engagement analytics
- n8n workflow suite
- Calendar/email integration
- Scale testing (3+ concurrent clients)

---

## CRITICAL GAPS IDENTIFIED (Self-Critique)

### 1. Timeline is Unrealistic ⚠️
**Problem:** 3 weeks for Phase 1 is too aggressive for scope proposed
- New MCP server from scratch
- 9+ SQLite tables
- 15+ MCP tools
- Notion bidirectional sync (complex!)
- Dashboard enhancements
- Documentation system

**Reality:** This is 5-6 weeks of work, AND you're delivering actual EasyVista engagement

**Math doesn't work:** If 3 weeks to BUILD tools, only 6-7 weeks to USE them for engagement. Shouldn't tools be ready EARLIER?

### 2. Over-Engineering for Future Problems ⚠️
**Multi-Interface Exposure (MCP + REST + CLI):**
- Triples implementation work
- Building for hypothetical Gemini migration
- Not needed for EasyVista success

**Auto-Generated Documentation Tool:**
- Meta-programming is complex for non-developer
- Manual CLAUDE.md is fine for Phase 1
- This can wait

### 3. Integration Complexity Underestimated ⚠️
**Notion Bidirectional Sync:**
- Complex property types (select, multi-select, relation, rollup)
- Conflict resolution (user edits in both places)
- Could be 2-week task alone, not "Week 2"

**MCP Server ↔ MCP Server Calls:**
- MCP designed for LLM ↔ Server, not Server ↔ Server
- How does this actually work? Architecture unclear.

**n8n Triggers MCP Tools:**
- MCP servers are local Python processes, not HTTP endpoints
- How does n8n call an MCP tool? Needs architectural detail.

### 4. Missing: What Does EasyVista ACTUALLY Need? ⚠️
**You ACTUALLY need:**
- Track 12 stakeholders (name, role, status, notes)
- Track 2 workstreams with phases
- Generate dashboard for Evan
- Deliver results by March 31

**I planned:**
- Full multi-client framework
- Methodology templates
- Financial integration
- Discovery questionnaires
- Risk analysis
- Cross-engagement analytics

**Tension:** Building a FRAMEWORK when you need a TOOL for EasyVista.

**Critical question:** Could you deliver EasyVista with ZERO new tools, just better Notion databases? If yes, tools should ENHANCE effectiveness, not be prerequisites.

### 5. No Testing or QA Strategy ⚠️
**Missing:**
- How to test Notion sync without breaking production?
- How to test with EasyVista data safely?
- Automated tests for data integrity?
- What if bug loses stakeholder data?

### 6. Backup/Recovery Not Detailed ⚠️
**Mentioned but underspecified:**
- Backup frequency? (Hourly? Daily?)
- Storage location? (Local? Dropbox? GitHub?)
- Restore procedure?
- SQLite corruption mitigation?

**Gap:** SQLite is single point of failure. If it corrupts, ALL engagement data lost.

### 7. Error Handling and Monitoring Missing ⚠️
**What happens when:**
- Notion API is down?
- GitHub Pages deploy fails?
- SQLite locks during concurrent write?
- n8n workflow fails?
- MCP server crashes?

**Gap:** No error handling strategy, no monitoring, no alerts.

### 8. Data Migration from client-timelines Underspecified ⚠️
client-timelines already has EasyVista data.

**Gap:**
- Manual mapping or automated?
- Incomplete data handling?
- Schema mismatch resolution?
- Validation process?

### 9. User Training/Onboarding Not Addressed ⚠️
**Gap:**
- How do you learn to use the tools?
- What's the mental model?
- What if Claude Code isn't available?

### 10. Time Commitment vs. Paid Work Trade-Off ⚠️
**Uncomfortable question:**
- Consulting work pays ($10-15K EasyVista)
- Building tools doesn't pay (immediately)
- Risk: Spending time on tools instead of client deliverables

**Is building this system the best use of time before March 31?**

---

## ALTERNATIVE APPROACHES TO CONSIDER

### Option A: EasyVista-First Approach (Conservative)
1. **Week 1-2:** Enhance Notion databases for EasyVista (no code)
2. **Week 3-4:** Build minimal MCP tools (5 core tools only)
3. **Week 5-8:** USE tools for EasyVista engagement
4. **Post-March 31:** Extract framework if it worked

**Pros:**
- Lower risk to EasyVista delivery
- Tools built based on real needs, not assumptions
- Framework extracted from proven patterns

**Cons:**
- Less AI-integrated during engagement
- Framework not ready for Tap immediately

### Option B: Hybrid Approach (Balanced)
1. **Phase 1 (5 weeks, not 3):** Core tools for EasyVista only
   - Skip: financial integration, discovery questionnaires, methodology templates
   - Focus: stakeholder tracking, dashboard generation, Notion sync
2. **Phase 2 (during EasyVista):** Use and refine tools with real data
3. **Phase 3 (post-March 31):** Extract framework if successful

**Pros:**
- Realistic timeline
- Core tools available for most of engagement
- Framework extracted from battle-tested tools

**Cons:**
- 5 weeks before tools ready (mid-February)
- Still risk to EasyVista if tools problematic

### Option C: Keep Full Plan, Extend Timeline
- Phase 1: 5 weeks (not 3)
- Phase 2: 3 weeks (not 2)
- Phase 3: 3 weeks (same)
- Acknowledge tools won't be fully ready until mid-February

**Pros:**
- Maintains full vision
- More realistic timeline

**Cons:**
- Tools available very late in engagement
- May not be valuable for EasyVista

---

## OPEN QUESTIONS

### Architectural
1. **How exactly do MCP servers call other MCP servers?** (consulting-framework-mcp → ecosystem-mcp-server)
2. **How does n8n trigger MCP tools?** (MCP servers don't expose HTTP endpoints)
3. **What's the Notion conflict resolution strategy?** (user edits in both Notion and SQLite)
4. **What's the SQLite corruption recovery plan?**

### Scope
1. **What's the true MVP for EasyVista success?** (vs. full framework)
2. **Can EasyVista succeed with just enhanced Notion?** (no code needed)
3. **What tools are actually prerequisites vs. enhancements?**
4. **Should we build framework first or extract after EasyVista?**

### Timeline
1. **Is 3 weeks realistic for Phase 1 scope?** (probably not)
2. **Should tools be ready earlier to be useful for engagement?** (yes)
3. **What's the balance between building vs. using tools?**

### Testing
1. **How to test with production EasyVista data safely?**
2. **What's the automated testing strategy?**
3. **How to validate data migration from client-timelines?**

---

## NEXT STEPS (When Resuming)

### Immediate Decision Needed
**Choose an approach:**
- Option A: EasyVista-First (low risk, extract framework after)
- Option B: Hybrid (5-week core tools, refine during engagement)
- Option C: Full Plan Extended (5-week Phase 1, tools ready mid-Feb)

### If Proceeding with Option B (Recommended)
1. **Simplify Phase 1 scope:**
   - Cut: financial integration, discovery questionnaires, auto-doc generation
   - Keep: 5 core MCP tools (stakeholder, workstream, dashboard, Notion sync, audit)
   - Extend: 3 weeks → 5 weeks

2. **Detail integration architecture:**
   - How MCP servers call each other (if needed)
   - How n8n calls MCP tools (via Python imports, not HTTP)
   - Notion sync conflict resolution strategy

3. **Define testing strategy:**
   - Test environment for Notion sync
   - EasyVista data clone for safe testing
   - Backup/restore procedures

4. **Clarify success metrics:**
   - What does "useful for EasyVista" mean?
   - What's required vs. nice-to-have?

### Implementation Readiness Checklist
Before writing code:
- [ ] Timeline revised and realistic
- [ ] Scope reduced to true MVP
- [ ] Integration architecture detailed
- [ ] Testing strategy defined
- [ ] Backup/recovery plan documented
- [ ] Error handling approach clarified
- [ ] User training plan outlined

---

## KEY INSIGHTS FROM PLANNING

1. **You already have 70% of capability** - Notion + client-timelines + ecosystem-mcp-server are strong
2. **Research recommendations were generic** - Plane/Metabase designed for teams without your MCP expertise
3. **One new server is sufficient** - consulting-framework-mcp integrates everything
4. **Static dashboards beat dynamic** - GitHub Pages + Python simpler than PostgreSQL + Metabase
5. **LLM-agnostic architecture is critical** - Don't lock into Claude-specific patterns
6. **Local-first data beats API dependency** - Monarch CSV import more reliable than API
7. **Timeline was too optimistic** - 3 weeks insufficient for proposed scope
8. **Framework vs. Tool tension** - Building for future vs. delivering EasyVista

---

## REFERENCE FILES

**Current State:**
- Plan file: `/Users/mdmac/.claude/plans/lucky-fluttering-sprout.md` (comprehensive)
- Research docs: `/Users/mdmac/Projects/consulting-framework/`
- Existing ecosystem: `/Users/mdmac/dev/ecosystem-mcp-server/` (pattern to follow)
- Working dashboard: `/Users/mdmac/Projects/client-timelines/` (EasyVista prototype)

**Key Patterns to Reuse:**
- ecosystem-mcp-server: Hub-and-spoke orchestration, SQLite audit trails
- monarch-mcp-server: Multi-layer auth (keyring → env → interactive)
- client-timelines: Static dashboard generation (Python + JSON → HTML)

---

## RECOMMENDATIONS

Based on gap analysis, I recommend:

1. **Revise timeline:** Phase 1 should be 5 weeks (not 3)
2. **Reduce scope:** Cut financial integration, discovery questionnaires, auto-docs from Phase 1
3. **Focus on EasyVista:** Build 5 core tools that directly support March 31 delivery
4. **Extract framework after:** Use EasyVista to prove patterns, then generalize for Tap
5. **Add testing plan:** Define how to test safely with production data
6. **Document error handling:** What happens when things break?
7. **Clarify integrations:** Detail how MCP servers communicate, how n8n calls tools

**The uncomfortable truth:** You might deliver EasyVista more successfully with simpler tools (enhanced Notion + manual dashboards), then build the framework after proving it works.

---

**Status:** ⏸️ Paused for decision on approach and timeline revision
**Next Session:** Choose approach (A/B/C), revise timeline, detail integration architecture
