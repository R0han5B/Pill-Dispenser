import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import Button from "../../components/ui/Button";
import PatientCard from "./components/PatientCard";
import PatientForm from "./components/PatientForm";
import SearchAndFilter from "./components/SearchAndFilter";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import EmptyState from "./components/EmptyState";
import toast from "react-hot-toast";

const PatientManagement = () => {
  const navigate = useNavigate();

  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Data State
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          navigate("/login");
          return;
        }

        setUserId(authUser.id);

        // Get user metadata - refresh to get latest
        const { data: { user: refreshedUser } } = await supabase.auth.refreshSession();
        const user = refreshedUser || authUser;
        
        const name = user.user_metadata?.name || user.user_metadata?.full_name || authUser.email?.split('@')[0] || '';
        const role = user.user_metadata?.role || 'Caregiver';
        
        const userData = {
          id: user.id,
          email: user.email || '',
          name: name,
          role: role
        };

        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load user profile');
      }
    };

    fetchUser();
  }, [navigate]);

  // Fetch patients from Supabase - FILTERED BY USER
  useEffect(() => {
    if (!userId) return;

    const fetchPatients = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching patients:", error.message);
        toast.error("Failed to load patients");
      } else {
        setPatients(data || []);
        setFilteredPatients(data || []);
      }
      setLoading(false);
    };

    fetchPatients();
  }, [userId]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...patients];

    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient?.medicalConditions?.some((condition) =>
            condition.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (activeFilters?.medicalCondition) {
      filtered = filtered.filter((patient) =>
        patient?.medicalConditions?.includes(activeFilters.medicalCondition)
      );
    }

    if (activeFilters?.compliance) {
      filtered = filtered.filter((patient) => {
        switch (activeFilters.compliance) {
          case "excellent":
            return patient.compliance >= 90;
          case "good":
            return patient.compliance >= 70 && patient.compliance < 90;
          case "needs-attention":
            return patient.compliance < 70;
          default:
            return true;
        }
      });
    }

    setFilteredPatients(filtered);
  }, [patients, searchTerm, activeFilters]);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Add/Edit Patient
  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsPatientFormOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setIsPatientFormOpen(true);
  };

  // Delete Patient
  const handleDeletePatient = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePatient = async () => {
    if (!patientToDelete) return;
    setIsDeleting(true);

    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("id", patientToDelete.id);

    if (error) {
      console.error("Error deleting patient:", error.message);
      toast.error("Failed to delete patient");
    } else {
      setPatients(patients.filter((p) => p.id !== patientToDelete.id));
      toast.success("Patient deleted successfully");
    }

    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setPatientToDelete(null);
  };

  // Save Patient (Add or Update) - WITH USER_ID
  const handleSavePatient = async (patientData) => {
    // Add user_id to patient data
    const patientWithUserId = { ...patientData, user_id: userId };

    let response;
    if (selectedPatient) {
      response = await supabase
        .from("patients")
        .update(patientWithUserId)
        .eq("id", selectedPatient.id)
        .select("*")
        .single();
    } else {
      response = await supabase.from("patients").insert([patientWithUserId]).select("*").single();
    }

    if (response.error) {
      console.error("Error saving patient:", response.error.message);
      toast.error("Failed to save patient");
    } else {
      toast.success("Patient saved successfully");

      if (selectedPatient) {
        setPatients(
          patients.map((p) => (p.id === selectedPatient.id ? response.data : p))
        );
      } else {
        setPatients([...patients, response.data]);
      }
      setIsPatientFormOpen(false);
      setSelectedPatient(null);
    }
  };

  const handleSearch = (term) => setSearchTerm(term);
  const handleFilter = (filters) => setActiveFilters(filters);
  const clearAllFilters = () => {
    setSearchTerm("");
    setActiveFilters({});
  };

  const hasActiveFilters =
    searchTerm || Object.keys(activeFilters).some((key) => activeFilters[key]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        alertCounts={{ schedules: 3, activity: 2 }}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-280"
        }`}
      >
        <Header
          user={user}
          onLogout={handleLogout}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Patient Management
                </h1>
                <p className="text-muted-foreground">
                  Manage patient profiles, medical conditions, and emergency contacts
                </p>
              </div>

              <Button
                onClick={handleAddPatient}
                iconName="Plus"
                iconPosition="left"
                className="mt-4 sm:mt-0"
              >
                Add New Patient
              </Button>
            </div>

            <SearchAndFilter
              onSearch={handleSearch}
              onFilter={handleFilter}
              totalPatients={filteredPatients.length}
            />

            {/* Patient Grid */}
            {loading ? (
              <p className="text-center text-muted-foreground mt-8">
                Loading patients...
              </p>
            ) : filteredPatients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onEdit={handleEditPatient}
                    onDelete={handleDeletePatient}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                onAddPatient={handleAddPatient}
                hasFilters={hasActiveFilters}
                onClearFilters={clearAllFilters}
              />
            )}
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
        isOpen={isPatientFormOpen}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        patientName={patientToDelete?.name}
        onConfirm={confirmDeletePatient}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setPatientToDelete(null);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PatientManagement;