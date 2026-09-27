import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable,
)
from reportlab.pdfgen import canvas

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 36  # 0.5 inch margins
USABLE_WIDTH = PAGE_WIDTH - (2 * MARGIN)  # 523.27 pt

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas for total page count calculation and consistent headers/footers.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        if self._pageNumber == 1:
            return  # Suppress running header/footer on cover page

        self.saveState()
        
        slate_line = colors.HexColor("#CBD5E1")
        text_muted = colors.HexColor("#64748B")
        primary_dark = colors.HexColor("#0F172A")

        # Running Header
        self.setStrokeColor(slate_line)
        self.setLineWidth(0.6)
        header_y = PAGE_HEIGHT - 26
        self.line(MARGIN, header_y, PAGE_WIDTH - MARGIN, header_y)
        
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(primary_dark)
        self.drawString(MARGIN, header_y + 5, "UIET E-CELL PLATFORM — USER & FEATURE MANUAL")
        
        self.setFont("Helvetica", 7.5)
        self.setFillColor(text_muted)
        self.drawRightString(PAGE_WIDTH - MARGIN, header_y + 5, "Role-Based Features & Button Guide")

        # Running Footer
        footer_y = 28
        self.line(MARGIN, footer_y, PAGE_WIDTH - MARGIN, footer_y)
        
        self.setFont("Helvetica", 7.5)
        self.setFillColor(text_muted)
        self.drawString(MARGIN, footer_y - 11, "UIET, Maharshi Dayanand University (MDU), Rohtak  •  E-Cell Team Guide")
        
        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.setFont("Helvetica-Bold", 7.5)
        self.drawRightString(PAGE_WIDTH - MARGIN, footer_y - 11, page_str)

        self.restoreState()


def build_pdf(filename="UIET_E-CELL_User_Manual.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN + 6,
        bottomMargin=MARGIN + 6,
    )

    styles = getSampleStyleSheet()

    # Color Palette Definitions
    c_primary = colors.HexColor("#0F172A")     # Slate 900
    c_secondary = colors.HexColor("#1E293B")   # Slate 800
    c_blue = colors.HexColor("#1D4ED8")        # Royal Blue
    c_amber = colors.HexColor("#B45309")       # Amber 700
    c_emerald = colors.HexColor("#047857")     # Emerald 700
    c_purple = colors.HexColor("#6D28D9")      # Purple 700
    c_slate_dark = colors.HexColor("#334155")
    c_slate_light = colors.HexColor("#F8FAFC")
    c_slate_border = colors.HexColor("#E2E8F0")

    # Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=21,
        leading=26,
        textColor=c_primary,
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_blue,
    )

    meta_label = ParagraphStyle(
        'CoverMetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=c_secondary,
    )

    meta_val = ParagraphStyle(
        'CoverMetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_slate_dark,
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=16,
        textColor=c_primary,
        spaceBefore=0,
        spaceAfter=4,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=c_blue,
        spaceBefore=5,
        spaceAfter=3,
        keepWithNext=True,
    )

    h3_style = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=c_secondary,
        spaceBefore=3,
        spaceAfter=2,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=c_slate_dark,
        spaceBefore=1,
        spaceAfter=2.5,
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=c_slate_dark,
        leftIndent=10,
        firstLineIndent=-6,
        spaceBefore=1,
        spaceAfter=2,
    )

    callout_text = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=11,
        textColor=c_slate_dark,
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.5,
        textColor=colors.white,
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=c_slate_dark,
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=c_primary,
    )

    def make_callout(text, title="KEY TAKEAWAY", alert_type="blue"):
        bg_col = colors.HexColor("#EFF6FF") if alert_type == "blue" else colors.HexColor("#FFFBEB")
        border_col = c_blue if alert_type == "blue" else c_amber
        t_style = ParagraphStyle(
            'CalloutHeader',
            fontName='Helvetica-Bold',
            fontSize=7.8,
            leading=10.5,
            textColor=border_col,
            spaceAfter=2,
        )
        content = [
            Paragraph(title, t_style),
            Paragraph(text, callout_text)
        ]
        t = Table([[content]], colWidths=[USABLE_WIDTH])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg_col),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
            ('LINELEFT', (0,0), (0,0), 3, border_col),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        return t

    story = []

    # ==========================================
    # PAGE 1: COVER & EXECUTIVE OVERVIEW
    # ==========================================
    badge_p = Paragraph("<font color='#1D4ED8'><b>ENTREPRENEURSHIP CELL (E-CELL)</b></font>  •  UIET MDU ROHTAK", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=c_blue))
    badge_t = Table([[badge_p]], colWidths=[USABLE_WIDTH])
    badge_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 0.8, colors.HexColor("#BFDBFE")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(badge_t)
    story.append(Spacer(1, 10))

    story.append(Paragraph("UIET E-CELL WEBSITE — ROLE & FEATURE GUIDE", title_style))
    story.append(Spacer(1, 3))
    story.append(Paragraph("A Plain-English User Manual Covering Every Role, Page, Feature, and Button", subtitle_style))
    story.append(Spacer(1, 6))

    story.append(HRFlowable(width="100%", thickness=1.5, color=c_primary, spaceBefore=2, spaceAfter=8))

    # Plain English Overview Callout
    exec_summary_html = (
        "<b>HOW THE WEBSITE WORKS IN SIMPLE WORDS:</b> The UIET E-Cell website is designed so that students and visitors "
        "can use 100% of the public features <b>without needing to register, sign up, or remember passwords</b>. "
        "Students can read announcements, register for events, download startup resources, apply for mentorship, and pitch ideas in seconds. "
        "Behind the scenes, only authorized E-Cell Core Team members log in through a private Admin Portal to manage content, "
        "approve student startups, track event registrations, and publish updates."
    )
    story.append(make_callout(exec_summary_html, title="PLAIN-ENGLISH PLATFORM OVERVIEW", alert_type="blue"))
    story.append(Spacer(1, 8))

    # Meta Table
    meta_data = [
        [Paragraph("Organization:", meta_label), Paragraph("E-Cell, UIET MDU Rohtak", meta_val),
         Paragraph("Portal Model:", meta_label), Paragraph("Open Public Access + Secure Admin Hub", meta_val)],
        [Paragraph("Target Audience:", meta_label), Paragraph("Students, Founders, Mentors & E-Cell Team", meta_val),
         Paragraph("Student Sign-Up:", meta_label), Paragraph("None Required (Zero Friction)", meta_val)],
        [Paragraph("Admin Login:", meta_label), Paragraph("Discreet Link in Footer (/login)", meta_val),
         Paragraph("Key Benefit:", meta_label), Paragraph("Instant event registrations & high participation", meta_val)],
    ]
    meta_table = Table(meta_data, colWidths=[95, 165, 95, 168])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_slate_light),
        ('BOX', (0,0), (-1,-1), 0.5, c_slate_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#F1F5F9")),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    # Summary of the 4 Roles
    story.append(Paragraph("THE 4 USER ROLES AT A GLANCE", h2_style))
    roles_overview = [
        [Paragraph("<b>1. Student / Visitor</b>", table_cell_bold), Paragraph("Browses events, blogs, and resources. Registers for workshops, applies for mentorship, and joins team recruitments — <b>with zero login</b>.", table_cell)],
        [Paragraph("<b>2. Student Founder</b>", table_cell_bold), Paragraph("Submits their startup idea or company profile via a public form to be featured in the official campus Startup Showcase.", table_cell)],
        [Paragraph("<b>3. Mentor / Alumni</b>", table_cell_bold), Paragraph("Showcased in the Mentor Directory. Receives guidance inquiries from students seeking startup and career advice.", table_cell)],
        [Paragraph("<b>4. E-Cell Admin (Team)</b>", table_cell_bold), Paragraph("Logs in to the <b>/admin</b> CMS. Controls all 11 management modules: creates events, approves startups, tracks RSVPs, and writes blogs.", table_cell)],
    ]
    roles_table = Table(roles_overview, colWidths=[120, 403])
    roles_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 0.5, c_slate_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(roles_table)

    story.append(PageBreak())

    # ==========================================
    # PAGE 2: ROLE 1 — STUDENTS & VISITORS
    # ==========================================
    story.append(Paragraph("Role 1: General Students & Campus Visitors", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_blue, spaceBefore=1, spaceAfter=6))

    story.append(Paragraph(
        "Students and visitors are the main audience of the platform. They can explore all information and interact with every "
        "initiative freely without signing in. Below is what they see, which buttons they can click, and what happens:",
        body_style
    ))

    student_features = [
        ("1. Exploring the Homepage (Route: /)",
         "<b>Features:</b> Live statistics counters (startups incubated, workshops conducted, students guided), "
         "an announcement alert bar at the top, upcoming event previews, featured campus startups, and campus photo gallery.<br/>"
         "<b>Key Buttons & Actions:</b><br/>"
         "• <b>'Explore Events' Button:</b> Jumps directly to the upcoming events calendar.<br/>"
         "• <b>'Submit Your Startup' Button:</b> Opens the startup application form for campus founders.<br/>"
         "• <b>Top Announcement Banner Click:</b> Expands details on urgent campus notices (e.g., hackathons or recruitment drives)."),

        ("2. Discovering & Registering for Events (Routes: /events & /events/[id])",
         "<b>Features:</b> Two organized tabs: <b>Upcoming Events</b> (open for registration) and <b>Past Events</b> (photo recaps and archives). "
         "Each event displays date, time, venue/online link, speaker info, and event posters.<br/>"
         "<b>Key Buttons & Actions:</b><br/>"
         "• <b>'RSVP Now / Register' Button on Card:</b> Opens the dedicated event detail page with the embedded registration form.<br/>"
         "• <b>'Confirm RSVP / Register' Button on Form:</b> Submits the student's Full Name, Email, Phone Number, Branch, and Roll Number. "
         "Shows an instant success message confirming their registration. No password or email verification needed!"),

        ("3. Accessing Free Entrepreneurship Resources (Route: /resources)",
         "<b>Features:</b> A digital library containing essential startup guides, legal documents, pitch decks, and software perks.<br/>"
         "<b>Key Buttons & Actions:</b><br/>"
         "• <b>Category Filter Pills:</b> Click 'Pitch Decks', 'Free Tools', 'Funding Guides', or 'Legal' to instantly filter resources.<br/>"
         "• <b>'Access Resource / Download' Button:</b> Opens official templates, guides, or software credit pages in a new tab."),

        ("4. Reading Campus Stories & Blog (Routes: /blog & /blog/[slug])",
         "<b>Features:</b> Articles on student founder journeys, event summaries, and entrepreneurial guides with estimated reading times.<br/>"
         "<b>Key Buttons & Actions:</b><br/>"
         "• <b>'Read Story' Button:</b> Opens the complete article with formatted text, images, and author details.<br/>"
         "• <b>Category & Tag Badges:</b> Click tags to view related articles."),

        ("5. Viewing Team & Joining E-Cell (Routes: /team & /contact)",
         "<b>Features:</b> Browse the student organizing committee by department (Leadership, Tech, Events, PR, Outreach).<br/>"
         "<b>Key Buttons & Actions:</b><br/>"
         "• <b>LinkedIn Profile Buttons:</b> Click any team member's card to visit their professional LinkedIn profile.<br/>"
         "• <b>'Submit Application' Button on /contact:</b> During recruitment drives, students fill out their details, choose preferred departments, "
         "and click submit to apply to join the E-Cell team."),
    ]

    for f_title, f_desc in student_features:
        story.append(Paragraph(f"<b>{f_title}</b>", h3_style))
        story.append(Paragraph(f_desc, body_style))

    story.append(Spacer(1, 4))
    story.append(make_callout(
        "<b>Why Students Love It:</b> There are no forms asking for passwords or email confirmation links. "
        "Students can complete an event RSVP on their phones between classes in less than 20 seconds.",
        title="ZERO-FRICTION USER EXPERIENCE",
        alert_type="blue"
    ))

    story.append(PageBreak())

    # ==========================================
    # PAGE 3: ROLE 2 (FOUNDERS) & ROLE 3 (MENTORS)
    # ==========================================
    story.append(Paragraph("Role 2: Student Founders & Campus Startups", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_blue, spaceBefore=1, spaceAfter=6))

    story.append(Paragraph(
        "Student founders are students from UIET who are actively building an idea, app, or business. The website provides them "
        "a platform to gain visibility among students, faculty, and visiting alumni.",
        body_style
    ))

    founder_features = [
        ("Browsing the Campus Startup Showcase (Route: /startups)",
         "Founders and students can explore what other teams on campus are building. "
         "Each startup card displays the logo, company name, founder names, student branch, one-line tagline, and business overview.<br/>"
         "• <b>'Visit Website / Demo' Button:</b> Takes visitors directly to the startup's live website or app."),

        ("Submitting a Startup for Listing (Route: /startups/new)",
         "Any student can pitch their startup to be featured on the platform.<br/>"
         "• <b>'Submit Your Startup' Button:</b> Located prominently on the homepage and startups page. Opens the submission form.<br/>"
         "• <b>The Form Fields:</b> Startup Name, Founder Name(s), Contact Email, Phone, Branch & Year, Tagline, Description, Website URL, and Logo link.<br/>"
         "• <b>'Submit for Review' Button:</b> Submits the application. The system immediately confirms submission and explains that an E-Cell Admin "
         "will review it before it goes live. This prevents spam while giving genuine student founders a stage."),
    ]

    for f_title, f_desc in founder_features:
        story.append(Paragraph(f"<b>{f_title}</b>", h3_style))
        story.append(Paragraph(f_desc, body_style))

    story.append(Spacer(1, 6))

    # Role 3: Mentors & Alumni
    story.append(Paragraph("Role 3: Alumni Mentors & Industry Experts", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_blue, spaceBefore=1, spaceAfter=6))

    story.append(Paragraph(
        "Mentors are accomplished alumni, seasoned entrepreneurs, and industry specialists who want to help UIET students succeed.",
        body_style
    ))

    mentor_features = [
        ("The Mentorship Directory (Route: /mentorship)",
         "Mentors do not need to create accounts or manage complex profiles. Their profiles are curated and verified by the E-Cell team. "
         "Each mentor card displays their photo, full name, professional role (e.g., Software Architect, Founder, Investor), UIET graduation year, "
         "bio, and areas of expertise (e.g., AI/ML, SaaS, Pitching, Marketing).<br/>"
         "• <b>'View LinkedIn' Button:</b> Allows students to learn more about the mentor's career."),

        ("Student Guidance Requests (Route: /mentorship/[id])",
         "When a student has a question or needs feedback on a startup idea, they can contact the mentor through the platform.<br/>"
         "• <b>'Request Guidance' Button:</b> Located on each mentor's card. Opens the guidance inquiry form.<br/>"
         "• <b>The Inquiry Form:</b> Student enters Name, Email, Phone, Branch, Startup Stage, and Specific Questions.<br/>"
         "• <b>'Send Request' Button:</b> Sends the request privately to the E-Cell team, who review it and connect the student with the mentor via email."),
    ]

    for m_title, m_desc in mentor_features:
        story.append(Paragraph(f"<b>{m_title}</b>", h3_style))
        story.append(Paragraph(m_desc, body_style))

    story.append(Spacer(1, 4))
    story.append(make_callout(
        "<b>Privacy Protection for Mentors:</b> Mentors' personal phone numbers and private email addresses are never published "
        "publicly on the website. All inquiries are screened by the E-Cell Core Team before being passed to mentors.",
        title="MENTOR PRIVACY & PROTECTION",
        alert_type="amber"
    ))

    story.append(PageBreak())

    # ==========================================
    # PAGE 4: ROLE 4 — ADMIN CMS (PART 1)
    # ==========================================
    story.append(Paragraph("Role 4: E-Cell Admin & Core Team (Admin Hub — Part 1)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_blue, spaceBefore=1, spaceAfter=6))

    story.append(Paragraph(
        "The E-Cell Core Team operates the website through the centralized <b>/admin</b> dashboard. "
        "Admins have full authority to create, edit, approve, and delete content. "
        "Below is how admins log in and use the first 5 management tabs:",
        body_style
    ))

    admin_login_box = [
        ("How Admins Access the Portal",
         "1. Scroll to the very bottom of any page.<br/>"
         "2. Click the discreet <b>'Admin Portal'</b> link in the website footer.<br/>"
         "3. On the login screen (<code>/login</code>), enter the Admin Email and Password.<br/>"
         "4. Click the <b>'Sign In to Admin Portal'</b> button. You are instantly redirected to <code>/admin</code>.<br/>"
         "<i>Note: Unauthorized visitors who try to open /admin are automatically sent back to the homepage.</i>")
    ]
    for a_title, a_desc in admin_login_box:
        story.append(Paragraph(f"<b>{a_title}</b>", h3_style))
        story.append(Paragraph(a_desc, body_style))

    story.append(Spacer(1, 4))
    story.append(Paragraph("Admin Tabs & Button Controls (Tabs 1 to 5)", h2_style))

    tab_descriptions_1 = [
        ("Tab 1: Overview & Metrics Dashboard ('overview')",
         "<b>What it does:</b> Displays high-level counters showing live platform activity at a glance.<br/>"
         "<b>Buttons & Features:</b> KPI metric cards showing Total Events, Total RSVPs, Pending Startups, and Unhandled Mentorship Requests. "
         "Each card has a direct link button taking the admin to that specific queue."),

        ("Tab 2: Team Management ('team')",
         "<b>What it does:</b> Controls the member listings displayed on the public <code>/team</code> page.<br/>"
         "<b>Buttons & Features:</b><br/>"
         "• <b>'Add Team Member' Button:</b> Opens form to input Name, Role, Department (Leadership, Tech, Events, PR), LinkedIn URL, and Photo.<br/>"
         "• <b>'Edit' (Pencil Icon) Button:</b> Update any member's details or department.<br/>"
         "• <b>'Active' Toggle Switch:</b> Quickly hide members who graduated without deleting their profile records.<br/>"
         "• <b>'Delete' (Trash Icon) Button:</b> Permanently removes a team member."),

        ("Tab 3: Events & RSVP Registrations ('events')",
         "<b>What it does:</b> Manages campus workshops, hackathons, and guest speaker sessions.<br/>"
         "<b>Buttons & Features:</b><br/>"
         "• <b>'Add Event' Button:</b> Opens event builder with Title, Date, Time, Venue/Meet link, Description, and Poster image upload.<br/>"
         "• <b>'View RSVPs' Button on Event:</b> Opens a side drawer listing every student registered for that specific workshop.<br/>"
         "• <b>'Export Attendees / CSV' Button:</b> Downloads an Excel-ready spreadsheet of student names, branches, and roll numbers for attendance & certificates.<br/>"
         "• <b>'Delete' Button:</b> Removes an event or individual spam registration."),

        ("Tab 4: Urgent Announcements & Pinned Banners ('announcements')",
         "<b>What it does:</b> Broadcasts urgent alerts, recruitment notices, and competition deadlines.<br/>"
         "<b>Buttons & Features:</b><br/>"
         "• <b>'New Announcement' Button:</b> Add Title, Message, Category (Urgent, Notice, Recruitment), and optional Link.<br/>"
         "• <b>'Pin to Top Banner' Toggle:</b> Pinned announcements display as a prominent alert banner at the very top of the website.<br/>"
         "• <b>'Active' Toggle:</b> Instantly turn an announcement on or off without deleting it."),

        ("Tab 5: Blog & Story CMS ('blog')",
         "<b>What it does:</b> Write and publish campus news, founder stories, and recap articles using the <code>BlogManager</code>.<br/>"
         "<b>Buttons & Features:</b><br/>"
         "• <b>'Write New Article' Button:</b> Opens the article editor with Markdown formatting tools.<br/>"
         "• <b>'Upload Cover Graphic' Button:</b> Uploads high-resolution banners.<br/>"
         "• <b>'Save as Draft' Button:</b> Saves work privately so you can finish writing later.<br/>"
         "• <b>'Publish Story' Button:</b> Immediately makes the article visible on the public <code>/blog</code> page."),
    ]

    for t_title, t_desc in tab_descriptions_1:
        story.append(Paragraph(f"<b>{t_title}</b>", h3_style))
        story.append(Paragraph(t_desc, body_style))

    story.append(PageBreak())

    # ==========================================
    # PAGE 5: ROLE 4 — ADMIN CMS (PART 2)
    # ==========================================
    story.append(Paragraph("Role 4: E-Cell Admin & Core Team (Admin Hub — Part 2)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_blue, spaceBefore=1, spaceAfter=6))

    story.append(Paragraph(
        "Here are the remaining 6 management tabs inside the <b>/admin</b> control center. "
        "These tabs handle startup approvals, mentorship connections, image galleries, homepage text, and recruitment hiring:",
        body_style
    ))

    tab_descriptions_2 = [
        ("Tab 6: Resource Library Manager ('resources')",
         "<b>What it does:</b> Keeps the entrepreneurship toolkits, pitch decks, and legal guides fresh and organized.<br/>"
         "<b>Buttons & Features:</b><br/>"
         "• <b>'Add Resource' Button:</b> Input Title, Resource Link/URL, Description, and select a Category.<br/>"
         "• <b>Category Dropdown:</b> Choose between 'Pitch Decks', 'Free Tools', 'Funding Guides', or 'Legal & Incorporation'.<br/>"
         "• <b>'Edit' & 'Delete' Buttons:</b> Update outdated links or remove retired resources."),

        ("Tab 7: Startup Moderation Queue ('startups')",
         "<b>What it does:</b> The review queue for student-submitted startups. Protects the website from spam.<br/>"
         "<b>Buttons & Features:</b><br/>"
         "• <b>Pending Submissions List:</b> Shows new pitches with founder names, branch, tagline, and website link.<br/>"
         "• <b>'Approve' (Green Check) Button:</b> Instantly publishes the startup to the public campus directory with an 'Approved' status.<br/>"
         "• <b>'Reject' (Red Cross) Button:</b> Rejects inappropriate or incomplete submissions.<br/>"
         "• <b>'Add Startup' Button:</b> Allows admins to directly add an approved startup without waiting for a student submission."),

        ("Tab 8: Mentorship & Inquiries Oversight ('mentorship')",
         "<b>What it does:</b> Manage the mentor directory and process student guidance requests.<br/>"
         "<b>Buttons & Features:</b><br/>"
         "• <b>'Add Mentor' Button:</b> Add new alumni or experts with name, bio, company role, expertise tags, and LinkedIn link.<br/>"
         "• <b>Student Inquiries Table:</b> Displays messages sent by students, including their project stage and questions.<br/>"
         "• <b>'Accept' / 'Decline' Status Buttons:</b> Track whether an inquiry has been forwarded and answered."),

        ("Tab 9: Website Photo Gallery ('images')",
         "<b>What it does:</b> Curates photos of campus hackathons, prize distributions, and team workshops.<br/>"
         "<b>Buttons & Features:</b><br/>"
         "• <b>'Upload Image' Button:</b> Choose photo file, enter title, and assign a Category (Workshops, Competitions, Team).<br/>"
         "• <b>Display Order Selector:</b> Change numeric rank to choose which photos appear first in the homepage gallery grid.<br/>"
         "• <b>'Delete' Button:</b> Removes old or duplicate photos."),

        ("Tab 10: Dynamic Homepage Blocks ('blocks')",
         "<b>What it does:</b> Change live numbers and headlines on the homepage without touching code.<br/>"
         "<b>Buttons & Features:</b><br/>"
         "• <b>Stats Counter Fields:</b> Update numbers for 'Startups Incubated', 'Workshops Held', and 'Community Members'.<br/>"
         "• <b>Hero Spotlight Fields:</b> Update the featured badge text, headline, and target button link.<br/>"
         "• <b>'Save Block Changes' Button:</b> Immediately updates the live homepage for all visitors."),

        ("Tab 11: Team Recruitment Applications ('applications')",
         "<b>What it does:</b> Private applicant tracker for annual recruitment drives.<br/>"
         "<b>Buttons & Features:</b><br/>"
         "• <b>Applicant Review Drawer:</b> Read student applications, department interests (Tech, Design, PR), and 'Why Join' statements.<br/>"
         "• <b>Status Dropdown Selector:</b> Advance candidates between 'Pending', 'Interviewed', 'Selected', and 'Rejected'.<br/>"
         "• <b>'Delete' Button:</b> Cleans up spam or archived recruitment applications."),
    ]

    for t_title, t_desc in tab_descriptions_2:
        story.append(Paragraph(f"<b>{t_title}</b>", h3_style))
        story.append(Paragraph(t_desc, body_style))

    story.append(Spacer(1, 4))
    story.append(make_callout(
        "<b>No Coding Required for Routine Tasks:</b> Marketing, event coordinators, and executive members can run all daily "
        "operations directly from the Admin Portal. There is no need to ask a developer to update events, post notices, or export attendee lists.",
        title="TEAM AUTONOMY & INDEPENDENCE",
        alert_type="blue"
    ))

    story.append(PageBreak())

    # ==========================================
    # PAGE 6: COMPLETE ROLE & BUTTON CHEAT SHEET
    # ==========================================
    story.append(Paragraph("Complete Role, Feature & Button Cheat Sheet", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_blue, spaceBefore=1, spaceAfter=6))

    story.append(Paragraph(
        "Use this master reference table to quickly see which user role can access which feature and what button triggers the action:",
        body_style
    ))

    cheat_sheet_data = [
        [Paragraph("User Role", table_header), Paragraph("Goal / Activity", table_header), Paragraph("Primary Buttons & Controls", table_header), Paragraph("End Result", table_header)],
        [Paragraph("<b>Student / Visitor</b>", table_cell_bold), Paragraph("Register for hackathon or workshop", table_cell), Paragraph("Click <b>'RSVP Now'</b> on card, then click <b>'Confirm RSVP'</b> on form", table_cell), Paragraph("Seat confirmed; appears in Admin attendee roster", table_cell)],
        [Paragraph("<b>Student / Visitor</b>", table_cell_bold), Paragraph("Download pitch deck or startup tools", table_cell), Paragraph("Click category pills, click <b>'Access Resource'</b>", table_cell), Paragraph("Opens template or guide in a new tab", table_cell)],
        [Paragraph("<b>Student / Visitor</b>", table_cell_bold), Paragraph("Apply to join E-Cell Core Team", table_cell), Paragraph("Fill /contact form, click <b>'Submit Application'</b>", table_cell), Paragraph("Application sent to Admin Recruitment queue", table_cell)],
        [Paragraph("<b>Student Founder</b>", table_cell_bold), Paragraph("Showcase startup in campus directory", table_cell), Paragraph("Click <b>'Submit Your Startup'</b>, fill form, click <b>'Submit for Review'</b>", table_cell), Paragraph("Enters Admin approval queue with 'Pending' badge", table_cell)],
        [Paragraph("<b>Student Founder</b>", table_cell_bold), Paragraph("Request 1-on-1 mentor guidance", table_cell), Paragraph("Click <b>'Request Guidance'</b> on mentor card, click <b>'Send Request'</b>", table_cell), Paragraph("Inquiry routed to E-Cell leads for email intro", table_cell)],
        [Paragraph("<b>Mentor / Alumni</b>", table_cell_bold), Paragraph("Help students & share expertise", table_cell), Paragraph("Profile card with bio, skills, and <b>'View LinkedIn'</b> button", table_cell), Paragraph("Receives verified student inquiries via E-Cell team", table_cell)],
        [Paragraph("<b>E-Cell Admin</b>", table_cell_bold), Paragraph("Create a new event & upload poster", table_cell), Paragraph("In Events tab, click <b>'Add Event'</b>, fill form, click <b>'Save'</b>", table_cell), Paragraph("Event instantly appears on public events page", table_cell)],
        [Paragraph("<b>E-Cell Admin</b>", table_cell_bold), Paragraph("Export registered attendees for certificates", table_cell), Paragraph("Click <b>'View RSVPs'</b> on event card, click <b>'Export Attendees'</b>", table_cell), Paragraph("Downloads formatted CSV roster of attendees", table_cell)],
        [Paragraph("<b>E-Cell Admin</b>", table_cell_bold), Paragraph("Moderate student startup submissions", table_cell), Paragraph("In Startups tab, click <b>'Approve' (Check)</b> or <b>'Reject' (X)</b>", table_cell), Paragraph("Approved startup goes live in public directory", table_cell)],
        [Paragraph("<b>E-Cell Admin</b>", table_cell_bold), Paragraph("Publish urgent notice or pinned banner", table_cell), Paragraph("Click <b>'New Announcement'</b>, toggle <b>'Pin to Top'</b>, click <b>'Save'</b>", table_cell), Paragraph("Banner appears on top of every page", table_cell)],
        [Paragraph("<b>E-Cell Admin</b>", table_cell_bold), Paragraph("Update live homepage stats without code", table_cell), Paragraph("In Blocks tab, edit numbers, click <b>'Save Changes'</b>", table_cell), Paragraph("Homepage counters update immediately", table_cell)],
    ]

    cheat_table = Table(cheat_sheet_data, colWidths=[80, 130, 173, 140])
    cheat_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_secondary),
        ('BOX', (0,0), (-1,-1), 0.5, c_slate_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_slate_light]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(cheat_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("Presentation Tips When Explaining to the Team", h2_style))
    tips = [
        "1. <b>Start with the Student Experience:</b> Remind your team that students will not register if there is a password wall. Show how clean and fast the RSVP form is on a mobile phone.",
        "2. <b>Show the Admin Power:</b> Demonstrate how easily an event lead can download the list of registered students with one click on 'Export Attendees'.",
        "3. <b>Emphasize Startup Support:</b> Show that student founders now have an official place to list their companies and request mentors without filling out physical forms.",
        "4. <b>Highlight Zero Maintenance Cost:</b> Reassure faculty and seniors that this platform does not cost any money to host or maintain."
    ]
    for tip in tips:
        story.append(Paragraph(tip, body_style))

    story.append(Spacer(1, 6))

    # Handover Verification Box
    signoff_p = Paragraph(
        "<b>OFFICIAL E-CELL UIET OPERATIONAL GUIDE:</b><br/>"
        "This user manual summarizes the day-to-day functionality of the UIET E-Cell platform. "
        "All core committee members should review this document during orientation to ensure smooth event management and communication.",
        ParagraphStyle('Signoff', fontName='Helvetica', fontSize=7.5, leading=10.5, textColor=c_slate_dark)
    )
    signoff_t = Table([[signoff_p]], colWidths=[USABLE_WIDTH])
    signoff_t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(signoff_t)

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Simple 6-page plain-English manual generated at: {filename}")

if __name__ == "__main__":
    out_pdf = "c:/E-CELL_UIET-MDU/UIET_E-CELL_User_Manual.pdf"
    if len(sys.argv) > 1:
        out_pdf = sys.argv[1]
    build_pdf(out_pdf)
