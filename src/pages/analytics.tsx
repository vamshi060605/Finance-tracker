// Analytics page: shows monthly snapshots, charts, and budget distribution

// This project uses Next.js Pages Router (not App Router)
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import "@/styles/globals.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from "recharts"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeProvider } from "next-themes"
import { AppSidebar } from "@/components/app-sidebar"
import { SPENDING_RULES } from "@/config/constants"
import { AuthGuard } from "@/components/auth-guard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { getCurrentUser } from "@/lib/auth"

interface ChartData {
  // Data type for chart visualizations
  name: string
  value: number
}

interface MonthlySnapshotsTable {
  // Type for monthly snapshot records
  id: string
  user_id: string
  month: number
  year: number
  needs_balance: number
  wants_balance: number
  savings_balance: number
  total_expenses: number
  created_at: string
}

export default function AnalyticsPage() {
  // State for monthly data, distribution, current snapshot, loading, and error
  const [monthlyData, setMonthlyData] = useState<MonthlySnapshotsTable[]>([])
  const [distribution, setDistribution] = useState<ChartData[]>([])
  const [currentSnapshot, setCurrentSnapshot] = useState<MonthlySnapshotsTable | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const userAvatar = "/default-avatar.png" // Replace with actual user avatar if available
  const userName = "User" // Replace with dynamic username from auth/profile

  useEffect(() => {
    // Initialize analytics data on mount
    const initialize = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          setError("Not authenticated")
          return
        }

        await Promise.all([
          fetchCurrentMonthSnapshot(user.id),
          fetchMonthlyData(user.id)
        ])
        
        setLoading(false)
      } catch (err) {
        console.error("Error initializing analytics:", err)
        setError("Failed to load analytics data")
        setLoading(false)
      }
    }

    initialize()
  }, [])

  useEffect(() => {
    if (currentSnapshot) {
      calculateDistribution()
    }
  }, [currentSnapshot])

  // Fetch and update current month snapshot
  async function fetchCurrentMonthSnapshot(userId: string) {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    try {
      // Get all transactions for current month
      const startOfMonth = new Date(currentYear, currentMonth - 1, 1).toISOString()
      const endOfMonth = new Date(currentYear, currentMonth, 0).toISOString()

      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

      if (txError) throw txError

      // Calculate balances
      const balances = (transactions || []).reduce((acc, tx) => {
        const amount = tx.type === 'expense' ? -tx.amount : tx.amount
        
        if (tx.category === 'needs') {
          acc.needs_balance += amount
        } else if (tx.category === 'wants') {
          acc.wants_balance += amount
        } else if (tx.category === 'savings') {
          acc.savings_balance += amount
        }
        
        acc.total_expenses += tx.type === 'expense' ? tx.amount : 0
        return acc
      }, {
        needs_balance: 0,
        wants_balance: 0,
        savings_balance: 0,
        total_expenses: 0
      })

      // Get existing snapshot or create new one
      const { data: existingSnapshot } = await supabase
        .from('monthly_snapshots')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .maybeSingle()

      if (existingSnapshot) {
        // Update existing snapshot
        const { data, error } = await supabase
          .from('monthly_snapshots')
          .update(balances)
          .eq('id', existingSnapshot.id)
          .select()
          .single()

        if (error) throw error
        setCurrentSnapshot(data)
      } else {
        // Create new snapshot
        const { data, error } = await supabase
          .from('monthly_snapshots')
          .insert({
            user_id: userId,
            month: currentMonth,
            year: currentYear,
            ...balances
          })
          .select()
          .single()

        if (error) throw error
        setCurrentSnapshot(data)
      }
    } catch (error) {
      console.error('Error in fetchCurrentMonthSnapshot:', error)
      throw error
    }
  }

  // Fetch all monthly snapshot data
  async function fetchMonthlyData(userId: string) {
    try {
      const { data: monthlySnapshots, error } = await supabase
        .from('monthly_snapshots')
        .select('*')
        .eq('user_id', userId)
        .order('year', { ascending: true })
        .order('month', { ascending: true })

      if (error) throw error

      const formattedData = (monthlySnapshots || []).map(snapshot => ({
        ...snapshot,
        month: new Date(snapshot.year, snapshot.month - 1).toLocaleString('default', { month: 'short' }),
        needs_spent: Math.abs(snapshot.needs_balance),
        wants_spent: Math.abs(snapshot.wants_balance),
        savings_accumulated: snapshot.savings_balance
      }))

      setMonthlyData(formattedData)
    } catch (error) {
      console.error('Error in fetchMonthlyData:', error)
      throw error
    }
  }

  // Calculate distribution for pie chart
  function calculateDistribution() {
    if (!currentSnapshot) return

    const data: ChartData[] = [
      { name: 'Needs', value: currentSnapshot.needs_balance || 0 },
      { name: 'Wants', value: currentSnapshot.wants_balance || 0 },
      { name: 'Savings', value: currentSnapshot.savings_balance || 0 }
    ]
    setDistribution(data)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    // Main UI: header, summary cards, bar chart, pie chart, and monthly summary
    <AuthGuard>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>  
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              </div>

              <Avatar className="cursor-pointer hover:opacity-80 transition">
                <AvatarImage src={userAvatar} alt="User Avatar" />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              
            </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 space-y-6">
              {/* Current Month Summary */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Needs Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₹{currentSnapshot?.needs_balance?.toFixed(2) || "0.00"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Wants Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                    ₹{currentSnapshot?.wants_balance?.toFixed(2) || "0.00"}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Savings Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₹{currentSnapshot?.savings_balance?.toFixed(2) || "0.00"}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="needs_balance" name="Needs" fill="#ef4444" />
                        <Bar dataKey="wants_balance" name="Wants" fill="#3b82f6" />
                        <Bar dataKey="savings_balance" name="Savings" fill="#22c55e" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Distribution + Summary */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Budget Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={distribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          />
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Income</div>
                        <div className="text-xl font-bold">
                          ₹{currentSnapshot?.total_expenses?.toFixed(2) || "0.00"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Expenses</div>
                        <div className="text-xl font-bold text-destructive">
                          ₹{currentSnapshot?.total_expenses?.toFixed(2) || "0.00"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </AuthGuard>
  )
}
