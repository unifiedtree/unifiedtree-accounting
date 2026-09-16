/**
 * SINGLE SOURCE OF TRUTH for navigation.
 * TopNav, TabPanel, SideNav and router.jsx all read from here.
 *
 * Rules:
 *  - Never change `id` — router keys depend on it.
 *  - Change `label` freely — it's display-only.
 *  - `group` controls sidebar grouping. Values:
 *      'main'     — always visible at top (Dashboard only)
 *      'daily'    — day-to-day work (Sales, Expenses, etc.)
 *      'finance'  — Tax, Reports
 *      'advanced' — collapsed by default (Setup, Assets, Tools, Storage, Alerts)
 */
import {
  LayoutDashboard, BookOpen, Users, FileText, Receipt,
  Landmark, BookMarked, Package, Calculator, BarChart3,
  HardDrive, BellRing, ShoppingCart, ClipboardList, BriefcaseBusiness,
  ArrowRightLeft, Wrench, Sparkles,
} from 'lucide-react'

const sections = [
  // ── MAIN ──────────────────────────────────────────────────────────────────
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    group: 'main',
    tabs: [
      { id: 'overview',      label: 'Overview'    },
      { id: 'cash-flow',     label: 'Cash Flow'   },
      { id: 'tax-calendar',  label: 'Tax Calendar' },
    ],
  },

  // ── DAILY ─────────────────────────────────────────────────────────────────
  {
    id: 'sales',
    label: 'Sales',
    icon: ShoppingCart,
    group: 'daily',
    tabs: [
      { id: 'quotations',         label: 'Quotations'        },
      { id: 'proforma-invoices',  label: 'PI'                },
      { id: 'sales-invoices',     label: 'Invoice'           },
      { id: 'delivery-challans',  label: 'Delivery Challan'  },
      { id: 'receipts',           label: 'Receipt'           },
    ],
  },
  {
    id: 'receivables',
    label: 'Money In',
    icon: FileText,
    group: 'daily',
    tabs: [
      { id: 'money-in-center',     label: 'Money In Center'        },
      { id: 'receivables',         label: 'Receivables'            },
      { id: 'payments-received',   label: 'Payments Received'      },
      { id: 'overdue-collections', label: 'Collections & Reminders' },
      { id: 'credit-notes',        label: 'Credit Notes & Refunds' },
      { id: 'sales-returns',       label: 'Sales Returns'          },
      { id: 'customer-statements', label: 'Customer Statements'    },
    ],
  },
  {
    id: 'procurement',
    label: 'Purchases',
    icon: ClipboardList,
    group: 'daily',
    tabs: [
      { id: 'purchase-center',      label: 'Purchase Center' },
      { id: 'purchase-orders',      label: 'Purchase Orders' },
      { id: 'goods-receipt',        label: 'Goods Receipt'   },
      { id: 'purchase-invoices',    label: 'Purchase Invoices' },
      { id: 'payment-out',          label: 'Payments Made'   },
      { id: 'returns-debit-notes',  label: 'Returns & Debit Notes' },
    ],
  },
  {
    id: 'payables',
    label: 'Money Out',
    icon: Receipt,
    group: 'daily',
    tabs: [
      { id: 'bills',        label: 'Pay Center'        },
      { id: 'payments',     label: 'Supplier Payments' },
      { id: 'workforce',    label: 'Workforce'         },
      { id: 'adjustments',  label: 'Adjustments'       },
      { id: 'bank-release', label: 'Bank Release'      },
    ],
  },
  {
    id: 'cashbank',
    label: 'Cash & Bank',
    icon: Landmark,
    group: 'daily',
    tabs: [
      { id: 'bank-accounts',   label: 'Cash & Bank Center'  },
      { id: 'reconciliation',  label: 'Bank Matching'       },
      { id: 'cash-petty',      label: 'Petty Cash'          },
    ],
  },
  {
    id: 'expenses',
    label: 'Expenses',
    icon: BookMarked,
    group: 'daily',
    tabs: [
      { id: 'expense-center',  label: 'Expense Center'    },
      { id: 'rules-recurring', label: 'Rules & Recurring' },
      { id: 'accounting',      label: 'Accounting'        },
      { id: 'close-control',   label: 'Close Control'     },
    ],
  },

  // ── FINANCE ───────────────────────────────────────────────────────────────
  {
    id: 'tax',
    label: 'Tax',
    icon: Calculator,
    group: 'finance',
    tabs: [
      { id: 'gst-returns',          label: 'GST Filing'          },
      { id: 'gst-filing-wizard',    label: '⚡ File GSTR-3B'     },
      { id: 'gst-reconciliation',   label: 'GST Matching'        },
      { id: 'e-invoicing',          label: 'E-Invoices'          },
      { id: 'e-way-bills',          label: 'E-Way Bills'         },
      { id: 'tds',                  label: 'TDS'                 },
      { id: 'tcs',                  label: 'TCS'                 },
      { id: 'tax-payments',         label: 'Pay Tax'             },
      { id: 'quarterly-compliance', label: 'Compliance Calendar' },
      { id: 'ca-access',            label: 'CA Temporary Access' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    group: 'finance',
    tabs: [
      { id: 'financial-statements', label: 'Financial Reports'    },
      { id: 'books',                label: 'Transaction Books'    },
      { id: 'gst-reports',          label: 'GST Reports'         },
      { id: 'ar-ap',                label: 'Receivables vs Payables' },
      { id: 'profitability',        label: 'Profitability'        },
      { id: 'period-comparatives',  label: 'Year Comparison'     },
      { id: 'budget-vs-actuals',    label: 'Budget Tracker'      },
      { id: 'cashflow-projection',  label: 'Cash Forecast'       },
      { id: 'report-builder',       label: 'Custom Reports'      },
    ],
  },
  {
    id: 'advanced-features',
    label: 'Advanced Features',
    icon: Sparkles,
    group: 'advanced',
    tabs: [
      { id: 'overview', label: 'Overview' },
    ],
  },

  // ── ADVANCED (collapsed by default in sidebar) ─────────────────────────────
  {
    id: 'parties',
    label: 'Customers & Suppliers',
    icon: Users,
    group: 'advanced',
    tabs: [
      { id: 'all-parties',      label: 'All Parties'       },
      { id: 'customer-ledgers', label: 'Customers'         },
      { id: 'supplier-ledgers', label: 'Suppliers'         },
      { id: 'shared-ledger',    label: 'Shared Ledger'     },
      { id: 'statements',       label: 'Statements'        },
      { id: 'reminders',        label: 'Reminders'         },
    ],
  },
  {
    id: 'inventory',
    label: 'Items',
    icon: Package,
    group: 'advanced',
    tabs: [
      { id: 'inventory-items', label: 'Items'              },
      { id: 'godowns',         label: 'Warehouses'         },
      { id: 'stock-movement',  label: 'Stock Movement'     },
      { id: 'item-pricing',    label: 'Pricing'            },
    ],
  },
  {
    id: 'assets',
    label: 'Fixed Assets',
    icon: Package,
    group: 'advanced',
    tabs: [
      { id: 'asset-register',       label: 'Asset List'          },
      { id: 'depreciation',         label: 'Depreciation'        },
      { id: 'disposal-revaluation', label: 'Sell or Revalue'     },
    ],
  },
  {
    id: 'masters',
    label: 'Setup & Configuration',
    icon: BookOpen,
    group: 'advanced',
    tabs: [
      { id: 'chart-of-accounts', label: 'Accounts List'      },
      { id: 'tax-masters',       label: 'Tax Rates'          },
      { id: 'cost-centers',      label: 'Cost Centers'       },
      { id: 'voucher-types',     label: 'Transaction Types'  },
      { id: 'opening-balances',  label: 'Starting Balances'  },
      { id: 'currencies',        label: 'Currencies'         },
    ],
  },
  {
    id: 'business-tools',
    label: 'Team & Tools',
    icon: BriefcaseBusiness,
    group: 'advanced',
    tabs: [
      { id: 'staff-payroll', label: 'Payroll'        },
      { id: 'manage-users',  label: 'User Access'    },
      { id: 'online-orders', label: 'Online Orders'  },
      { id: 'sms-marketing', label: 'SMS Marketing'  },
    ],
  },
  {
    id: 'party-tools',
    label: 'Party Tools',
    icon: Wrench,
    group: 'advanced',
    tabs: [
      { id: 'documents',       label: 'Party Documents'  },
      { id: 'portal',          label: 'Party Portal'     },
      { id: 'import',          label: 'Party Import'     },
      { id: 'duplicate-merge', label: 'Duplicate Merge'  },
      { id: 'gap-analysis',    label: 'Gap Analysis'     },
    ],
  },
  {
    id: 'item-tools',
    label: 'Item Tools',
    icon: Wrench,
    group: 'advanced',
    tabs: [
      { id: 'reorder-alerts', label: 'Reorder Alerts' },
      { id: 'batch-serials',  label: 'Batch & Serial' },
      { id: 'barcode-labels', label: 'Barcode Labels' },
      { id: 'item-import',    label: 'Item Import'    },
      { id: 'gap-analysis',   label: 'Gap Analysis'   },
    ],
  },
  {
    id: 'storage',
    label: 'Documents',
    icon: HardDrive,
    group: 'advanced',
    tabs: [
      { id: 'client-storage',      label: 'Client Files'    },
      { id: 'unifiedtree-storage', label: 'Cloud Storage'   },
    ],
  },
  {
    id: 'alerts',
    label: 'Alerts',
    icon: BellRing,
    group: 'advanced',
    tabs: [
      { id: 'accountant-alerts', label: 'Accountant Alerts'  },
      { id: 'compliance-alerts', label: 'Compliance Alerts'  },
      { id: 'cash-risk-alerts',  label: 'Cash & Risk Alerts' },
      { id: 'ca-access',         label: 'CA Temporary Access' },
    ],
  },
  {
    id: 'migration',
    label: 'Data Migration',
    icon: ArrowRightLeft,
    group: 'advanced',
    tabs: [
      { id: 'import', label: 'Import Data'    },
      { id: 'export', label: 'Export Data'    },
      { id: 'history', label: 'Import History' },
    ],
  },
]

export default sections

/** Quick lookup by section id */
export const sectionById = Object.fromEntries(sections.map(s => [s.id, s]))
