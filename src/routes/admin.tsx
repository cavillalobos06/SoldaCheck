import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Trash2,
  Edit,
  Wrench,
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api, type User, type Machine } from "@/lib/api";
import { refreshMachines } from "@/lib/machines";
import { StatusBadge } from "@/components/machine-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de Administración — SoldaCheck" },
      { name: "description", content: "Panel de administración y gestión de máquinas y usuarios." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Data states
  const [machines, setMachines] = useState<Machine[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Machine Filters
  const [machineSearch, setMachineSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Machine Dialog
  const [isMachineDialogOpen, setIsMachineDialogOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [machineForm, setMachineForm] = useState({
    id: "",
    name: "",
    brand: "",
    model: "",
    weldType: "MIG",
    voltage: "220 V",
    amperage: "10 – 250 A",
    dutyCycle: "40% @ 250 A",
    location: "Nave A · Línea 1",
    status: "operativa",
    notes: "",
  });

  // User Dialog
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  // Delete Confirmation Dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "machine" | "user";
    id: string;
    name: string;
  }>({ open: false, type: "machine", id: "", name: "" });

  // Load backend data
  const loadData = async () => {
    try {
      setLoadingData(true);
      setErrorMsg(null);
      const [fetchedMachines, fetchedUsers] = await Promise.all([
        api.getMachines(),
        api.getUsers(),
      ]);
      setMachines(fetchedMachines);
      setUsers(fetchedUsers);
    } catch (err: any) {
      setErrorMsg(err.message || "Error al cargar datos del backend");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  // Flash messages helper
  const showNotice = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Auth protection guard
  if (authLoading) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground animate-pulse">Verificando permisos de acceso...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Acceso Restringido</h1>
        <p className="text-sm text-muted-foreground">
          Esta sección está reservada exclusivamente para el Administrador del sistema.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/">Volver al Inventario</Link>
          </Button>
          <Button asChild className="bg-warning text-warning-foreground hover:bg-warning/90">
            <Link to="/login">Iniciar sesión como Admin</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Stats calculation
  const totalMachines = machines.length;
  const operativas = machines.filter((m) => m.status === "operativa").length;
  const enRevision = machines.filter((m) => m.status === "en_revision").length;
  const mantenimiento = machines.filter((m) => m.status === "mantenimiento").length;

  // Filtered machines
  const filteredMachines = machines.filter((m) => {
    const matchSearch =
      m.id.toLowerCase().includes(machineSearch.toLowerCase()) ||
      m.name.toLowerCase().includes(machineSearch.toLowerCase()) ||
      m.brand.toLowerCase().includes(machineSearch.toLowerCase()) ||
      m.model.toLowerCase().includes(machineSearch.toLowerCase()) ||
      m.location.toLowerCase().includes(machineSearch.toLowerCase());
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Machine Handlers
  const handleOpenCreateMachine = () => {
    setEditingMachine(null);
    setMachineForm({
      id: `SLD-MIG-${String(machines.length + 1).padStart(3, "0")}`,
      name: "",
      brand: "",
      model: "",
      weldType: "MIG",
      voltage: "220 V",
      amperage: "10 – 250 A",
      dutyCycle: "40% @ 250 A",
      location: "Nave A · Bahía 1",
      status: "operativa",
      notes: "",
    });
    setIsMachineDialogOpen(true);
  };

  const handleOpenEditMachine = (m: Machine) => {
    setEditingMachine(m);
    setMachineForm({
      id: m.id,
      name: m.name,
      brand: m.brand,
      model: m.model,
      weldType: Array.isArray(m.weldType) ? m.weldType.join(", ") : m.weldType,
      voltage: m.voltage,
      amperage: m.amperage,
      dutyCycle: m.dutyCycle,
      location: m.location,
      status: m.status,
      notes: m.notes || "",
    });
    setIsMachineDialogOpen(true);
  };

  const handleSaveMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const weldTypesArray = machineForm.weldType
        .split(/[,/ ]+/)
        .map((w) => w.trim().toUpperCase())
        .filter(Boolean);

      const payload = {
        ...machineForm,
        weldType: weldTypesArray.length > 0 ? weldTypesArray : ["MIG"],
      };

      if (editingMachine) {
        await api.updateMachine(editingMachine.id, payload);
        showNotice(`Máquina ${editingMachine.id} actualizada correctamente.`);
      } else {
        await api.createMachine(payload);
        showNotice(`Nueva máquina ${payload.id} creada en inventario.`);
      }

      setIsMachineDialogOpen(false);
      await loadData();
      refreshMachines();
    } catch (err: any) {
      alert(err.message || "Error al guardar la máquina");
    }
  };

  const handleQuickStatusChange = async (machineId: string, newStatus: string) => {
    try {
      await api.updateMachine(machineId, { status: newStatus });
      setMachines((prev) =>
        prev.map((m) => (m.id === machineId ? { ...m, status: newStatus } : m))
      );
      refreshMachines();
      showNotice(`Estado de ${machineId} actualizado a "${newStatus}".`);
    } catch (err: any) {
      alert(err.message || "Error al actualizar estado");
    }
  };

  // User Handlers
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      name: "",
      email: "",
      password: "",
      role: "user",
    });
    setIsUserDialogOpen(true);
  };

  const handleOpenEditUser = (u: User) => {
    setEditingUser(u);
    setUserForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
    });
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const payload: any = {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
        };
        if (userForm.password.trim()) {
          payload.password = userForm.password;
        }
        await api.updateUser(editingUser.id, payload);
        showNotice(`Usuario ${editingUser.name} actualizado con éxito.`);
      } else {
        if (!userForm.password || userForm.password.length < 6) {
          alert("La contraseña debe tener al menos 6 caracteres.");
          return;
        }
        await api.createUser(userForm);
        showNotice(`Usuario ${userForm.name} creado exitosamente.`);
      }

      setIsUserDialogOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Error al procesar el usuario");
    }
  };

  // Deletion confirm
  const handleConfirmDelete = async () => {
    try {
      if (deleteDialog.type === "machine") {
        await api.deleteMachine(deleteDialog.id);
        showNotice(`Máquina ${deleteDialog.id} eliminada.`);
        refreshMachines();
      } else {
        await api.deleteUser(deleteDialog.id);
        showNotice(`Usuario ${deleteDialog.name} eliminado.`);
      }
      setDeleteDialog({ open: false, type: "machine", id: "", name: "" });
      await loadData();
    } catch (err: any) {
      alert(err.message || "Error al eliminar recurso");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-warning text-warning-foreground font-bold text-xs">
              <Shield className="h-4 w-4" />
            </span>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Gestión centralizada de recursos, ficha técnica de máquinas e inspectores del sistema.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loadingData}>
            <RotateCcw className={`h-4 w-4 mr-1.5 ${loadingData ? "animate-spin" : ""}`} />
            Refrescar datos
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link to="/">Ver Inventario Público</Link>
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <Alert className="border-success/30 bg-success/10 text-success-foreground py-2.5">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-sm font-medium">{successMsg}</AlertDescription>
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="destructive" className="py-2.5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">{errorMsg}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-3 shadow-card">
          <p className="font-display text-2xl font-bold text-foreground">{totalMachines}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Máquinas</p>
        </Card>
        <Card className="p-3 shadow-card">
          <p className="font-display text-2xl font-bold text-success">{operativas}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">En buen estado</p>
        </Card>
        <Card className="p-3 shadow-card">
          <p className="font-display text-2xl font-bold text-amber-500">{enRevision}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Para revisión</p>
        </Card>
        <Card className="p-3 shadow-card">
          <p className="font-display text-2xl font-bold text-destructive">{mantenimiento}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">En mantenimiento</p>
        </Card>
        <Card className="p-3 shadow-card col-span-2 md:col-span-1">
          <p className="font-display text-2xl font-bold text-primary">{users.length}</p>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Usuarios Registrados</p>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="machines" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="machines" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Máquinas y Fichas ({machines.length})
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuarios del Sistema ({users.length})
          </TabsTrigger>
        </TabsList>

        {/* ==========================================
            TAB 1: GESTIÓN DE MÁQUINAS
            ========================================== */}
        <TabsContent value="machines" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2 max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar máquina por código, modelo, marca o ubicación..."
                  value={machineSearch}
                  onChange={(e) => setMachineSearch(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 h-10">
                  <SelectValue placeholder="Filtrar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="operativa">Buen estado</SelectItem>
                  <SelectItem value="en_revision">Para revisión</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleOpenCreateMachine} className="bg-primary font-semibold shrink-0">
              <Plus className="h-4 w-4 mr-1.5" />
              Nueva Máquina
            </Button>
          </div>

          <div className="rounded-lg border bg-card shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Código / Equipo</TableHead>
                  <TableHead className="font-semibold">Marca & Modelo</TableHead>
                  <TableHead className="font-semibold">Ficha Técnica</TableHead>
                  <TableHead className="font-semibold">Ubicación</TableHead>
                  <TableHead className="font-semibold">Estado Actual</TableHead>
                  <TableHead className="text-right font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMachines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No se encontraron máquinas con los filtros especificados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMachines.map((m) => (
                    <TableRow key={m.id} className="hover:bg-muted/20">
                      <TableCell>
                        <div className="font-mono text-xs font-bold text-primary">{m.id}</div>
                        <div className="font-semibold text-sm">{m.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{m.brand}</div>
                        <div className="text-xs text-muted-foreground">{m.model}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-0.5">
                          <span className="inline-block bg-muted px-1.5 py-0.5 rounded font-mono text-[11px] mr-1">
                            {Array.isArray(m.weldType) ? m.weldType.join("/") : m.weldType}
                          </span>
                          <div className="text-muted-foreground">{m.voltage} · {m.amperage}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {m.location}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={m.status}
                            onValueChange={(val) => handleQuickStatusChange(m.id, val)}
                          >
                            <SelectTrigger className="h-8 text-xs w-44">
                              <SelectValue>
                                <StatusBadge status={m.status} />
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="operativa">
                                <span className="text-success font-medium">✓ Buen estado / Operativa</span>
                              </SelectItem>
                              <SelectItem value="en_revision">
                                <span className="text-amber-500 font-medium">⚠ Para revisión</span>
                              </SelectItem>
                              <SelectItem value="mantenimiento">
                                <span className="text-destructive font-medium">✕ En mantenimiento</span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleOpenEditMachine(m)}
                            title="Editar ficha técnica"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                type: "machine",
                                id: m.id,
                                name: m.name,
                              })
                            }
                            title="Eliminar máquina"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ==========================================
            TAB 2: GESTIÓN DE USUARIOS
            ========================================== */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Usuarios autorizados para acceder al inventario e inspeccionar equipos.
            </p>
            <Button onClick={handleOpenCreateUser} className="font-semibold">
              <Plus className="h-4 w-4 mr-1.5" />
              Nuevo Usuario
            </Button>
          </div>

          <div className="rounded-lg border bg-card shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Nombre del Usuario</TableHead>
                  <TableHead className="font-semibold">Correo Electrónico</TableHead>
                  <TableHead className="font-semibold">Rol Asignado</TableHead>
                  <TableHead className="font-semibold">Fecha de Creación</TableHead>
                  <TableHead className="text-right font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const isCurrent = u.id === user.id;
                  return (
                    <TableRow key={u.id} className="hover:bg-muted/20">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{u.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                              (Tú)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {u.email}
                      </TableCell>
                      <TableCell>
                        {u.role === "admin" ? (
                          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold bg-warning/20 text-warning-foreground border border-warning/30">
                            👑 Administrador
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            👷 Técnico / Operador
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleOpenEditUser(u)}
                            title="Editar usuario"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isCurrent}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive disabled:opacity-30"
                            onClick={() =>
                              setDeleteDialog({
                                open: true,
                                type: "user",
                                id: u.id,
                                name: u.name,
                              })
                            }
                            title={isCurrent ? "No puedes eliminar tu propia cuenta" : "Eliminar usuario"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ==========================================
          MODAL: CREAR / EDITAR MÁQUINA
          ========================================== */}
      <Dialog open={isMachineDialogOpen} onOpenChange={setIsMachineDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMachine ? `Editar Máquina: ${editingMachine.id}` : "Crear Nueva Máquina"}
            </DialogTitle>
            <DialogDescription>
              Registra los parámetros operativos y ficha técnica del equipo de soldadura.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveMachine} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="m-id">Código / Identificador *</Label>
                <Input
                  id="m-id"
                  placeholder="ej: SLD-MIG-007"
                  disabled={!!editingMachine}
                  value={machineForm.id}
                  onChange={(e) => setMachineForm({ ...machineForm, id: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="m-name">Nombre del Equipo *</Label>
                <Input
                  id="m-name"
                  placeholder="ej: Soldadora MIG Pulsada"
                  value={machineForm.name}
                  onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="m-brand">Marca *</Label>
                <Input
                  id="m-brand"
                  placeholder="ej: Lincoln Electric, Miller, ESAB"
                  value={machineForm.brand}
                  onChange={(e) => setMachineForm({ ...machineForm, brand: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="m-model">Modelo *</Label>
                <Input
                  id="m-model"
                  placeholder="ej: Power MIG 360MP"
                  value={machineForm.model}
                  onChange={(e) => setMachineForm({ ...machineForm, model: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="m-weldType">Procesos (Separados por coma) *</Label>
                <Input
                  id="m-weldType"
                  placeholder="ej: MIG, TIG, MMA"
                  value={machineForm.weldType}
                  onChange={(e) => setMachineForm({ ...machineForm, weldType: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="m-voltage">Voltaje *</Label>
                <Input
                  id="m-voltage"
                  placeholder="ej: 220 / 440 V"
                  value={machineForm.voltage}
                  onChange={(e) => setMachineForm({ ...machineForm, voltage: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="m-amperage">Rango de Amperaje *</Label>
                <Input
                  id="m-amperage"
                  placeholder="ej: 10 – 350 A"
                  value={machineForm.amperage}
                  onChange={(e) => setMachineForm({ ...machineForm, amperage: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="m-duty">Ciclo de Trabajo *</Label>
                <Input
                  id="m-duty"
                  placeholder="ej: 60% @ 300 A"
                  value={machineForm.dutyCycle}
                  onChange={(e) => setMachineForm({ ...machineForm, dutyCycle: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="m-loc">Ubicación en Planta *</Label>
                <Input
                  id="m-loc"
                  placeholder="ej: Nave A · Línea 2"
                  value={machineForm.location}
                  onChange={(e) => setMachineForm({ ...machineForm, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="m-status">Estado de Disponibilidad *</Label>
              <Select
                value={machineForm.status}
                onValueChange={(val) => setMachineForm({ ...machineForm, status: val })}
              >
                <SelectTrigger id="m-status">
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operativa">Buen estado / Operativa</SelectItem>
                  <SelectItem value="en_revision">Para revisión</SelectItem>
                  <SelectItem value="mantenimiento">En mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="m-notes">Notas / Observaciones Técnicas</Label>
              <Input
                id="m-notes"
                placeholder="Observaciones de inspección, historial de reparaciones..."
                value={machineForm.notes}
                onChange={(e) => setMachineForm({ ...machineForm, notes: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsMachineDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="font-semibold">
                {editingMachine ? "Guardar Cambios" : "Crear Máquina"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ==========================================
          MODAL: CREAR / EDITAR USUARIO
          ========================================== */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? `Editar Usuario: ${editingUser.name}` : "Crear Nuevo Usuario"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Actualiza los datos o el rol del usuario seleccionado."
                : "Crea credenciales para un nuevo miembro del equipo."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveUser} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="u-name">Nombre Completo *</Label>
              <Input
                id="u-name"
                placeholder="ej: Andrés Morales"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="u-email">Correo Electrónico *</Label>
              <Input
                id="u-email"
                type="email"
                placeholder="ej: andres@example.com"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="u-password">
                {editingUser ? "Nueva Contraseña (Opcional)" : "Contraseña *"}
              </Label>
              <Input
                id="u-password"
                type="password"
                placeholder={editingUser ? "Dejar en blanco para mantener la actual" : "Mínimo 6 caracteres"}
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required={!editingUser}
                minLength={editingUser && !userForm.password ? undefined : 6}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="u-role">Rol en la Plataforma *</Label>
              <Select
                value={userForm.role}
                onValueChange={(val) => setUserForm({ ...userForm, role: val })}
              >
                <SelectTrigger id="u-role">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">👷 Técnico / Operador</SelectItem>
                  <SelectItem value="admin">👑 Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="font-semibold">
                {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ==========================================
          MODAL: CONFIRMACIÓN DE ELIMINACIÓN
          ========================================== */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <DialogContent className="max-w-sm text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2">
            <Trash2 className="h-6 w-6" />
          </div>
          <DialogHeader>
            <DialogTitle>¿Confirmar eliminación?</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar permanentemente {deleteDialog.type === "machine" ? "la máquina" : "al usuario"}{" "}
              <strong>"{deleteDialog.name}"</strong>? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center pt-3">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
