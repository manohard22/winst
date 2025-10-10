const request = require('supertest');
const app = require('../server');

describe('Admin Project Requirements API', () => {
  let adminToken;
  let testProgramId;
  let testRequirementId;

  // Mock authentication middleware for testing
  jest.mock('../middleware/auth', () => ({
    authenticateToken: (req, res, next) => {
      req.user = { id: 'test-admin-id', role: 'admin' };
      next();
    },
    requireRole: (roles) => (req, res, next) => {
      if (roles.includes(req.user.role)) {
        next();
      } else {
        res.status(403).json({ success: false, message: 'Access denied' });
      }
    }
  }));

  describe('POST /api/admin/projects/requirements', () => {
    it('should create project requirements successfully', async () => {
      const response = await request(app)
        .post('/api/admin/projects/requirements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          programId: 'test-program-id',
          title: 'Test Project',
          description: 'Test project description',
          requirements: 'Test requirements',
          deliverables: 'Test deliverables',
          evaluationCriteria: 'Test criteria',
          estimatedDurationWeeks: 4,
          maxScore: 100,
          isMandatory: true,
          orderIndex: 0
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Project requirements created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('createdAt');

      testRequirementId = response.body.data.id;
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/admin/projects/requirements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Test Project'
          // Missing required fields
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Missing required fields');
    });
  });

  describe('PUT /api/admin/projects/requirements/:id', () => {
    it('should update project requirements successfully', async () => {
      const response = await request(app)
        .put(`/api/admin/projects/requirements/${testRequirementId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Test Project',
          description: 'Updated test project description'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Project requirements updated successfully');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('should return 404 for non-existent project requirements', async () => {
      const response = await request(app)
        .put('/api/admin/projects/requirements/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Test Project'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Project requirements not found');
    });
  });

  describe('DELETE /api/admin/projects/requirements/:id', () => {
    it('should delete project requirements successfully', async () => {
      const response = await request(app)
        .delete(`/api/admin/projects/requirements/${testRequirementId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Project requirements deleted successfully');
    });

    it('should return 404 for non-existent project requirements', async () => {
      const response = await request(app)
        .delete('/api/admin/projects/requirements/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Project requirements not found');
    });
  });
});