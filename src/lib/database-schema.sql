-- Enhanced SeniorSimple CMS Database Schema
-- This schema supports calculators, tools, guides, and checklists with full SEO optimization

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Content Types Enum
CREATE TYPE content_type_enum AS ENUM (
    'guide',
    'calculator', 
    'tool',
    'checklist',
    'comparison'
);

-- Difficulty Levels Enum
CREATE TYPE difficulty_level_enum AS ENUM (
    'beginner',
    'intermediate', 
    'advanced'
);

-- Article Status Enum
CREATE TYPE article_status_enum AS ENUM (
    'draft',
    'published',
    'pending',
    'private',
    'scheduled'
);

-- Priority Levels Enum
CREATE TYPE priority_level_enum AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

-- Enhanced Articles Table
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    html_body TEXT,
    excerpt TEXT,
    
    -- Content Classification
    content_type content_type_enum NOT NULL DEFAULT 'guide',
    difficulty_level difficulty_level_enum NOT NULL DEFAULT 'beginner',
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    
    -- SEO Fields
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT[],
    canonical_url VARCHAR(500),
    
    -- Open Graph Fields
    og_title VARCHAR(255),
    og_description TEXT,
    og_image VARCHAR(500),
    
    -- Twitter Card Fields
    twitter_title VARCHAR(255),
    twitter_description TEXT,
    twitter_image VARCHAR(500),
    
    -- Content Analysis
    reading_time INTEGER,
    readability_score INTEGER,
    semantic_keywords TEXT[],
    topic_cluster VARCHAR(100),
    featured_snippet_optimized BOOLEAN DEFAULT FALSE,
    
    -- Interactive Elements
    calculator_config JSONB,
    tool_config JSONB,
    checklist_config JSONB,
    
    -- Performance Metrics
    engagement_score DECIMAL(5,2) DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    
    -- Metadata
    author_id UUID,
    status article_status_enum NOT NULL DEFAULT 'draft',
    priority priority_level_enum DEFAULT 'medium',
    featured BOOLEAN DEFAULT FALSE,
    featured_image_url VARCHAR(500),
    featured_image_alt VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT articles_title_length CHECK (char_length(title) > 0),
    CONSTRAINT articles_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT articles_reading_time_positive CHECK (reading_time > 0),
    CONSTRAINT articles_readability_score_range CHECK (readability_score >= 0 AND readability_score <= 100)
);

-- Article Categories Table
CREATE TABLE IF NOT EXISTS article_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES article_categories(id),
    color VARCHAR(7) DEFAULT '#36596A',
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Article Tags Table
CREATE TABLE IF NOT EXISTS article_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#E4CDA1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Article-Tag Junction Table
CREATE TABLE IF NOT EXISTS article_tags_junction (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES article_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- Content Sections Table (for structured content)
CREATE TABLE IF NOT EXISTS content_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    section_type VARCHAR(50) NOT NULL DEFAULT 'text',
    section_order INTEGER NOT NULL,
    interactive_elements JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calculator Inputs Table
CREATE TABLE IF NOT EXISTS calculator_inputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    input_id VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    input_type VARCHAR(50) NOT NULL,
    required BOOLEAN DEFAULT FALSE,
    default_value TEXT,
    validation_rules JSONB,
    help_text TEXT,
    placeholder VARCHAR(255),
    input_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calculator Outputs Table
CREATE TABLE IF NOT EXISTS calculator_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    output_id VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    output_type VARCHAR(50) NOT NULL,
    format_string VARCHAR(100),
    description TEXT,
    calculation_formula TEXT,
    output_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calculator Charts Table
CREATE TABLE IF NOT EXISTS calculator_charts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    chart_id VARCHAR(100) NOT NULL,
    chart_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    data_source VARCHAR(100),
    chart_config JSONB,
    chart_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tool Steps Table
CREATE TABLE IF NOT EXISTS tool_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    step_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    form_fields JSONB,
    validation_rules JSONB,
    next_step_condition TEXT,
    step_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checklist Items Table
CREATE TABLE IF NOT EXISTS checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    item_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(100),
    priority priority_level_enum DEFAULT 'medium',
    estimated_time VARCHAR(50),
    resources JSONB,
    item_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checklist Categories Table
CREATE TABLE IF NOT EXISTS checklist_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    category_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#36596A',
    icon VARCHAR(50),
    category_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ Items Table
CREATE TABLE IF NOT EXISTS faq_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    faq_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Interactions Table (for tracking engagement)
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    user_id UUID,
    interaction_type VARCHAR(50) NOT NULL, -- 'view', 'click', 'complete', 'share'
    interaction_data JSONB,
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Analytics Table
CREATE TABLE IF NOT EXISTS content_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    avg_time_on_page INTEGER DEFAULT 0, -- in seconds
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id, date)
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_articles_content_type ON articles(content_type);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_meta_keywords ON articles USING GIN(meta_keywords);
CREATE INDEX IF NOT EXISTS idx_articles_semantic_keywords ON articles USING GIN(semantic_keywords);
CREATE INDEX IF NOT EXISTS idx_articles_calculator_config ON articles USING GIN(calculator_config);
CREATE INDEX IF NOT EXISTS idx_articles_tool_config ON articles USING GIN(tool_config);
CREATE INDEX IF NOT EXISTS idx_articles_checklist_config ON articles USING GIN(checklist_config);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_articles_search ON articles USING GIN(
    to_tsvector('english', title || ' ' || content || ' ' || excerpt)
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON article_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON content_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO article_categories (name, slug, description, color, icon, sort_order) VALUES
('Retirement Planning', 'retirement-planning', 'Comprehensive retirement planning guides and tools', '#36596A', 'piggy-bank', 1),
('Medicare', 'medicare', 'Medicare enrollment, costs, and coverage guides', '#E4CDA1', 'shield-alt', 2),
('Estate Planning', 'estate-planning', 'Wills, trusts, and estate planning resources', '#F5F5F0', 'file-text', 3),
('Insurance', 'insurance', 'Life, health, and long-term care insurance guides', '#D4AF37', 'umbrella', 4),
('Housing', 'housing', 'Home equity, reverse mortgages, and housing options', '#8B4513', 'home', 5),
('Taxes', 'taxes', 'Tax planning and optimization strategies', '#DC143C', 'calculator', 6),
('Investments', 'investments', 'Investment strategies and financial planning', '#228B22', 'trending-up', 7)
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO article_tags (name, slug, description, color) VALUES
('Calculator', 'calculator', 'Interactive calculation tools', '#4CAF50'),
('Guide', 'guide', 'Comprehensive how-to guides', '#2196F3'),
('Tool', 'tool', 'Interactive planning tools', '#FF9800'),
('Checklist', 'checklist', 'Step-by-step checklists', '#9C27B0'),
('Medicare', 'medicare', 'Medicare-related content', '#00BCD4'),
('Retirement', 'retirement', 'Retirement planning content', '#795548'),
('Estate Planning', 'estate-planning', 'Estate planning content', '#607D8B'),
('Insurance', 'insurance', 'Insurance-related content', '#E91E63'),
('Tax Planning', 'tax-planning', 'Tax planning content', '#FF5722'),
('Housing', 'housing', 'Housing and real estate content', '#8BC34A')
ON CONFLICT (slug) DO NOTHING;

-- Row Level Security (RLS) Policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;

-- Public read access for published articles
CREATE POLICY "Public can view published articles" ON articles
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view categories" ON article_categories
    FOR SELECT USING (true);

CREATE POLICY "Public can view tags" ON article_tags
    FOR SELECT USING (true);

CREATE POLICY "Public can view content sections" ON content_sections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM articles 
            WHERE articles.id = content_sections.article_id 
            AND articles.status = 'published'
        )
    );

-- Similar policies for other tables...
CREATE POLICY "Public can view calculator inputs" ON calculator_inputs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM articles 
            WHERE articles.id = calculator_inputs.article_id 
            AND articles.status = 'published'
        )
    );

CREATE POLICY "Public can view calculator outputs" ON calculator_outputs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM articles 
            WHERE articles.id = calculator_outputs.article_id 
            AND articles.status = 'published'
        )
    );

CREATE POLICY "Public can view calculator charts" ON calculator_charts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM articles 
            WHERE articles.id = calculator_charts.article_id 
            AND articles.status = 'published'
        )
    );

CREATE POLICY "Public can view tool steps" ON tool_steps
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM articles 
            WHERE articles.id = tool_steps.article_id 
            AND articles.status = 'published'
        )
    );

CREATE POLICY "Public can view checklist items" ON checklist_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM articles 
            WHERE articles.id = checklist_items.article_id 
            AND articles.status = 'published'
        )
    );

CREATE POLICY "Public can view checklist categories" ON checklist_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM articles 
            WHERE articles.id = checklist_categories.article_id 
            AND articles.status = 'published'
        )
    );

CREATE POLICY "Public can view FAQ items" ON faq_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM articles 
            WHERE articles.id = faq_items.article_id 
            AND articles.status = 'published'
        )
    );

-- Allow public to insert user interactions (for analytics)
CREATE POLICY "Public can insert interactions" ON user_interactions
    FOR INSERT WITH CHECK (true);

-- Views for easier querying
CREATE VIEW published_articles AS
SELECT 
    a.*,
    ac.name as category_name,
    ac.slug as category_slug,
    ac.color as category_color,
    ac.icon as category_icon
FROM articles a
LEFT JOIN article_categories ac ON a.category = ac.slug
WHERE a.status = 'published'
ORDER BY a.published_at DESC;

CREATE VIEW article_with_tags AS
SELECT 
    a.*,
    COALESCE(
        array_agg(
            DISTINCT jsonb_build_object(
                'id', at.id,
                'name', at.name,
                'slug', at.slug,
                'color', at.color
            )
        ) FILTER (WHERE at.id IS NOT NULL),
        '{}'
    ) as tags
FROM articles a
LEFT JOIN article_tags_junction atj ON a.id = atj.article_id
LEFT JOIN article_tags at ON atj.tag_id = at.id
GROUP BY a.id;

-- Functions for common operations
CREATE OR REPLACE FUNCTION get_articles_by_category(category_slug TEXT, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    slug VARCHAR(255),
    excerpt TEXT,
    content_type content_type_enum,
    reading_time INTEGER,
    published_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.content_type,
        a.reading_time,
        a.published_at
    FROM articles a
    WHERE a.category = category_slug 
    AND a.status = 'published'
    ORDER BY a.published_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_articles(search_term TEXT, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    slug VARCHAR(255),
    excerpt TEXT,
    content_type content_type_enum,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.content_type,
        ts_rank(
            to_tsvector('english', a.title || ' ' || a.content || ' ' || COALESCE(a.excerpt, '')),
            plainto_tsquery('english', search_term)
        ) as rank
    FROM articles a
    WHERE a.status = 'published'
    AND (
        to_tsvector('english', a.title || ' ' || a.content || ' ' || COALESCE(a.excerpt, ''))
        @@ plainto_tsquery('english', search_term)
        OR a.title ILIKE '%' || search_term || '%'
        OR a.content ILIKE '%' || search_term || '%'
    )
    ORDER BY rank DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT ON user_interactions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_articles_by_category TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_articles TO anon, authenticated;





