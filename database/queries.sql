-- USEFUL QUERIES FOR LUCRO INTERNSHIP PORTAL

-- 1. Get all active students with their internship details
SELECT 
    u.full_name,
    u.email,
    u.phone,
    t.tech_name,
    si.start_date,
    si.end_date,
    si.status,
    si.progress_percentageFROM users u
JOIN student_internship si ON u.user_id = si.student_id
JOIN technologies t ON si.tech_id = t.tech_id
WHERE si.status = 'active'
ORDER BY si.enrollment_date DESC;

-- 2. Get payment summary by technology
SELECT 
    t.tech_name,
    COUNT(p.payment_id) as total_payments,
    SUM(p.amount) as total_revenue,
    AVG(p.amount) as average_payment
FROM technologies t
JOIN orders o ON t.tech_id = o.tech_id
JOIN payments p ON o.order_id = p.order_id
WHERE p.payment_status = 'completed'
GROUP BY t.tech_id, t.tech_name
ORDER BY total_revenue DESC;

-- 3. Get student progress with task completion
SELECT 
    u.full_name,
    u.email,
    t.tech_name,
    si.progress_percentage,
    COUNT(CASE WHEN ts.status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(ts.task_id) as total_assigned_tasks,
    ROUND(
        (COUNT(CASE WHEN ts.status = 'completed' THEN 1 END) * 100.0 / 
         NULLIF(COUNT(ts.task_id), 0)), 2
    ) as task_completion_rate
FROM users u
JOIN student_internship si ON u.user_id = si.student_id
JOIN technologies t ON si.tech_id = t.tech_id
LEFT JOIN tasks ts ON u.user_id = ts.assigned_to
WHERE u.role_id = 2
GROUP BY u.user_id, u.full_name, u.email, t.tech_name, si.progress_percentage
ORDER BY si.progress_percentage DESC;

-- 4. Get pending payments with student details
SELECT 
    u.full_name,
    u.email,
    u.phone,
    t.tech_name,
    o.total_amount,
    o.final_amount,
    o.order_date,
    p.payment_status
FROM users u
JOIN orders o ON u.user_id = o.student_id
JOIN technologies t ON o.tech_id = t.tech_id
LEFT JOIN payments p ON o.order_id = p.order_id
WHERE o.status = 'pending' OR p.payment_status = 'pending'
ORDER BY o.order_date DESC;

-- 5. Get top performing students
SELECT 
    u.full_name,
    u.email,
    t.tech_name,
    si.progress_percentage,
    COUNT(sub.submission_id) as submissions_count,
    AVG(CASE 
        WHEN sub.grade = 'A+' THEN 4.0
        WHEN sub.grade = 'A' THEN 3.7
        WHEN sub.grade = 'B+' THEN 3.3
        WHEN sub.grade = 'B' THEN 3.0
        ELSE 2.0
    END) as avg_grade_points
FROM users u
JOIN student_internship si ON u.user_id = si.student_id
JOIN technologies t ON si.tech_id = t.tech_id
LEFT JOIN task_submissions sub ON u.user_id = sub.student_id
WHERE u.role_id = 2
GROUP BY u.user_id, u.full_name, u.email, t.tech_name, si.progress_percentage
HAVING COUNT(sub.submission_id) > 0
ORDER BY avg_grade_points DESC, si.progress_percentage DESC
LIMIT 10;

-- 6. Get revenue analytics by month
SELECT 
    DATE_TRUNC('month', p.payment_date) as payment_month,
    COUNT(p.payment_id) as payment_count,
    SUM(p.amount) as monthly_revenue,
    COUNT(DISTINCT o.student_id) as unique_students
FROM payments p
JOIN orders o ON p.order_id = o.order_id
WHERE p.payment_status = 'completed'
GROUP BY DATE_TRUNC('month', p.payment_date)
ORDER BY payment_month DESC;

-- 7. Get overdue tasks
SELECT 
    u.full_name,
    u.email,
    t.title as task_title,
    t.due_date,
    tech.tech_name,
    CURRENT_DATE - t.due_date as days_overdue
FROM tasks t
JOIN users u ON t.assigned_to = u.user_id
JOIN technologies tech ON t.tech_id = tech.tech_id
WHERE t.status IN ('pending', 'in_progress') 
AND t.due_date < CURRENT_DATE
ORDER BY days_overdue DESC;

-- 8. Get certificate eligibility
SELECT 
    u.full_name,
    u.email,
    t.tech_name,
    si.progress_percentage,
    si.status,
    CASE 
        WHEN ic.certificate_id IS NOT NULL THEN 'Issued'
        WHEN si.status = 'completed' AND si.progress_percentage >= 80 THEN 'Eligible'
        ELSE 'Not Eligible'
    END as certificate_status
FROM users u
JOIN student_internship si ON u.user_id = si.student_id
JOIN technologies t ON si.tech_id = t.tech_id
LEFT JOIN internship_certificates ic ON u.user_id = ic.student_id AND t.tech_id = ic.tech_id
WHERE u.role_id = 2
ORDER BY si.progress_percentage DESC;

-- 9. Get mentor workload
SELECT 
    si.mentor_assigned,
    COUNT(si.student_id) as students_assigned,
    COUNT(CASE WHEN si.status = 'active' THEN 1 END) as active_students,
    COUNT(CASE WHEN si.status = 'completed' THEN 1 END) as completed_students
FROM student_internship si
GROUP BY si.mentor_assigned
ORDER BY students_assigned DESC;

-- 10. Get technology popularity and success rate
SELECT 
    t.tech_name,
    t.price,
    COUNT(si.student_id) as total_enrollments,
    COUNT(CASE WHEN si.status = 'completed' THEN 1 END) as completions,
    ROUND(
        (COUNT(CASE WHEN si.status = 'completed' THEN 1 END) * 100.0 / 
         NULLIF(COUNT(si.student_id), 0)), 2
    ) as completion_rate,
    SUM(o.final_amount) as total_revenue
FROM technologies t
LEFT JOIN student_internship si ON t.tech_id = si.tech_id
LEFT JOIN orders o ON t.tech_id = o.tech_id AND o.status = 'paid'
GROUP BY t.tech_id, t.tech_name, t.price
ORDER BY total_enrollments DESC;
