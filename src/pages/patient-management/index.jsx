import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

import Button from '../../components/ui/Button';
import PatientCard from './components/PatientCard';
import PatientForm from './components/PatientForm';
import SearchAndFilter from './components/SearchAndFilter';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import EmptyState from './components/EmptyState';

const PatientManagement = () => {
  const navigate = useNavigate();
  const [user] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@healthcare.com',
    role: 'Primary Caregiver'
  });

  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Data State
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  // Mock Data
  const mockPatients = [
  {
    id: 1,
    name: 'Margaret Thompson',
    age: 78,
    avatar: "https://images.unsplash.com/photo-1616286608358-0e1b143f7d2f",
    avatarAlt: 'Elderly woman with gray hair and gentle smile wearing light blue cardigan',
    medicalConditions: ['Diabetes', 'Hypertension', 'Arthritis'],
    emergencyContact: {
      name: 'Robert Thompson',
      phone: '+1 (555) 123-4567',
      relationship: 'Son'
    },
    activeSchedules: 4,
    compliance: 92,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'James Wilson',
    age: 65,
    avatar: "https://images.unsplash.com/photo-1727015219386-10a19cd81dcc",
    avatarAlt: 'Senior man with white beard wearing navy blue shirt and glasses',
    medicalConditions: ['Heart Disease', 'High Cholesterol', 'Depression'],
    emergencyContact: {
      name: 'Linda Wilson',
      phone: '+1 (555) 987-6543',
      relationship: 'Wife'
    },
    activeSchedules: 3,
    compliance: 76,
    createdAt: '2024-02-20T14:15:00Z'
  },
  {
    id: 3,
    name: 'Dorothy Martinez',
    age: 82,
    avatar: "https://images.unsplash.com/photo-1507320136482-b892ce119cd0",
    avatarAlt: 'Elderly Hispanic woman with silver hair wearing purple blouse and pearl necklace',
    medicalConditions: ['Osteoporosis', 'Anxiety', 'Asthma'],
    emergencyContact: {
      name: 'Carlos Martinez',
      phone: '+1 (555) 456-7890',
      relationship: 'Grandson'
    },
    activeSchedules: 2,
    compliance: 68,
    createdAt: '2024-03-10T09:45:00Z'
  },
  {
    id: 4,
    name: 'Robert Chen',
    age: 71,
    avatar: "https://images.unsplash.com/photo-1707147165084-11e8efe2de29",
    avatarAlt: 'Asian elderly man with gray hair wearing white polo shirt and warm smile',
    medicalConditions: ['COPD', 'Diabetes', 'Hypertension'],
    emergencyContact: {
      name: 'Susan Chen',
      phone: '+1 (555) 234-5678',
      relationship: 'Daughter'
    },
    activeSchedules: 5,
    compliance: 94,
    createdAt: '2024-01-28T16:20:00Z'
  },
  {
    id: 5,
    name: 'Eleanor Davis',
    age: 69,
    avatar: "https://images.unsplash.com/photo-1551862390-7894b509f8ad",
    avatarAlt: 'Senior woman with short blonde hair wearing green sweater and friendly expression',
    medicalConditions: ['Alzheimer\'s', 'Hypertension'],
    emergencyContact: {
      name: 'Michael Davis',
      phone: '+1 (555) 345-6789',
      relationship: 'Son'
    },
    activeSchedules: 3,
    compliance: 58,
    createdAt: '2024-02-05T11:30:00Z'
  }];


  // Initialize data
  useEffect(() => {
    const savedPatients = localStorage.getItem('smartpill_patients');
    if (savedPatients) {
      const parsedPatients = JSON.parse(savedPatients);
      setPatients(parsedPatients);
      setFilteredPatients(parsedPatients);
    } else {
      setPatients(mockPatients);
      setFilteredPatients(mockPatients);
      localStorage.setItem('smartpill_patients', JSON.stringify(mockPatients));
    }
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...patients];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered?.filter((patient) =>
      patient?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      patient?.medicalConditions?.some((condition) =>
      condition?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
      );
    }

    // Apply medical condition filter
    if (activeFilters?.medicalCondition) {
      filtered = filtered?.filter((patient) =>
      patient?.medicalConditions?.includes(activeFilters?.medicalCondition)
      );
    }

    // Apply compliance filter
    if (activeFilters?.compliance) {
      filtered = filtered?.filter((patient) => {
        switch (activeFilters?.compliance) {
          case 'excellent':
            return patient?.compliance >= 90;
          case 'good':
            return patient?.compliance >= 70 && patient?.compliance < 90;
          case 'needs-attention':
            return patient?.compliance < 70;
          default:
            return true;
        }
      });
    }

    setFilteredPatients(filtered);
  }, [patients, searchTerm, activeFilters]);

  // Event Handlers
  const handleLogout = () => {
    localStorage.removeItem('smartpill_user');
    navigate('/login');
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsPatientFormOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsPatientFormOpen(true);
  };

  const handleDeletePatient = (patientId) => {
    const patient = patients?.find((p) => p?.id === patientId);
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePatient = async () => {
    if (!patientToDelete) return;

    setIsDeleting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let updatedPatients = patients?.filter((p) => p?.id !== patientToDelete?.id);
      setPatients(updatedPatients);
      localStorage.setItem('smartpill_patients', JSON.stringify(updatedPatients));

      setIsDeleteModalOpen(false);
      setPatientToDelete(null);
    } catch (error) {
      console.error('Error deleting patient:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSavePatient = async (patientData) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let updatedPatients;
      if (selectedPatient) {
        // Update existing patient
        updatedPatients = patients?.map((p) =>
        p?.id === selectedPatient?.id ? patientData : p
        );
      } else {
        // Add new patient
        updatedPatients = [...patients, patientData];
      }

      setPatients(updatedPatients);
      localStorage.setItem('smartpill_patients', JSON.stringify(updatedPatients));
      setIsPatientFormOpen(false);
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (filters) => {
    setActiveFilters(filters);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
  };

  const hasActiveFilters = searchTerm || Object.keys(activeFilters)?.some((key) => activeFilters?.[key]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        alertCounts={{
          schedules: 3,
          activity: 2
        }} />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
      isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-280'}`
      }>
        {/* Header */}
        <Header
          user={user}
          onLogout={handleLogout}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />


        {/* Page Content */}
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Patient Management</h1>
                <p className="text-muted-foreground">
                  Manage patient profiles, medical conditions, and emergency contacts
                </p>
              </div>
              
              <Button
                onClick={handleAddPatient}
                iconName="Plus"
                iconPosition="left"
                className="mt-4 sm:mt-0">

                Add New Patient
              </Button>
            </div>

            {/* Search and Filter */}
            <SearchAndFilter
              onSearch={handleSearch}
              onFilter={handleFilter}
              totalPatients={filteredPatients?.length} />


            {/* Patient Grid */}
            {filteredPatients?.length > 0 ?
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPatients?.map((patient) =>
              <PatientCard
                key={patient?.id}
                patient={patient}
                onEdit={handleEditPatient}
                onDelete={handleDeletePatient} />

              )}
              </div> :

            <EmptyState
              onAddPatient={handleAddPatient}
              hasFilters={hasActiveFilters}
              onClearFilters={clearAllFilters} />

            }

            {/* Quick Stats */}
            {patients?.length > 0 &&
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{patients?.length}</div>
                  <div className="text-sm text-muted-foreground">Total Patients</div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-success">
                    {patients?.reduce((sum, p) => sum + p?.activeSchedules, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Schedules</div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-accent">
                    {Math.round(patients?.reduce((sum, p) => sum + p?.compliance, 0) / patients?.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Compliance</div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-warning">
                    {patients?.filter((p) => p?.compliance < 70)?.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Need Attention</div>
                </div>
              </div>
            }
          </div>
        </main>
      </div>
      {/* Patient Form Modal */}
      <PatientForm
        patient={selectedPatient}
        onSave={handleSavePatient}
        onCancel={() => {
          setIsPatientFormOpen(false);
          setSelectedPatient(null);
        }}
        isOpen={isPatientFormOpen} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        patientName={patientToDelete?.name}
        onConfirm={confirmDeletePatient}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setPatientToDelete(null);
        }}
        isDeleting={isDeleting} />

    </div>);

};

export default PatientManagement;