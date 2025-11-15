-- Add ServiceNow program to internship_programs table
INSERT INTO internship_programs (
  title,
  slug,
  description,
  category,
  duration_weeks,
  difficulty_level,
  price,
  currency,
  is_active,
  is_featured,
  created_at,
  updated_at
) VALUES (
  'ServiceNow Platform Administration',
  'servicenow-platform-administration',
  'Comprehensive program to learn ServiceNow platform administration, configuration, and ITSM best practices. Master instance management, workflow automation, and service delivery.',
  'Enterprise Solutions',
  12,
  'intermediate',
  9999.00,
  'INR',
  true,
  false,
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO NOTHING;
