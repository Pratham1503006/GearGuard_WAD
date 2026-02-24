// Mock data for development without backend
export const mockData = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', password: 'password123' }
  ],
  
  equipment: [
    { id: 1, name: 'CNC Machine A', work_center_id: 1, status: 'operational' },
    { id: 2, name: 'Hydraulic Press', work_center_id: 1, status: 'operational' },
    { id: 3, name: 'Welding Station B', work_center_id: 2, status: 'operational' },
    { id: 4, name: 'Assembly Robot', work_center_id: 3, status: 'needs_maintenance' }
  ],
  
  workCenters: [
    { id: 1, name: 'Machine Shop', location: 'Building A' },
    { id: 2, name: 'Welding Department', location: 'Building B' },
    { id: 3, name: 'Assembly Line', location: 'Building C' }
  ],
  
  teams: [
    { id: 1, name: 'Maintenance Team A', members_count: 5 },
    { id: 2, name: 'Maintenance Team B', members_count: 4 }
  ],
  
  maintenance: [
    {
      id: 1,
      subject: 'Urgent: CNC Machine A - Oil leak',
      equipment_id: 1,
      equipment_name: 'CNC Machine A',
      work_center_id: 1,
      type: 'corrective',
      category: 'hydraulics',
      status: 'open',
      priority: 'high',
      scheduled_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to_name: 'John Doe',
      assigned_to_user_id: 1
    },
    {
      id: 2,
      subject: 'Preventive maintenance - Hydraulic Press filters',
      equipment_id: 2,
      equipment_name: 'Hydraulic Press',
      work_center_id: 1,
      type: 'preventive',
      category: 'filters',
      status: 'open',
      priority: 'medium',
      scheduled_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to_name: null,
      assigned_to_user_id: null
    },
    {
      id: 3,
      subject: 'Welding Station B - electrode replacement',
      equipment_id: 3,
      equipment_name: 'Welding Station B',
      work_center_id: 2,
      type: 'preventive',
      category: 'consumables',
      status: 'repaired',
      priority: 'low',
      scheduled_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to_name: 'Jane Smith',
      assigned_to_user_id: 2
    },
    {
      id: 4,
      subject: 'Assembly Robot - calibration needed',
      equipment_id: 4,
      equipment_name: 'Assembly Robot',
      work_center_id: 3,
      type: 'corrective',
      category: 'calibration',
      status: 'open',
      priority: 'high',
      scheduled_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to_name: null,
      assigned_to_user_id: null
    }
  ]
};
