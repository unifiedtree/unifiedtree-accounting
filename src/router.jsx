import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import RequireAccess from './components/layout/RequireAccess'
import sections from './config/sections'
import PlaceholderPage from './features/PlaceholderPage'

// Advanced Features
import AdvancedFeatures from './features/advanced/AdvancedFeatures'

// Dashboard
import DashboardOverview   from './features/dashboard/DashboardOverview'
import DashboardCashFlow   from './features/dashboard/DashboardCashFlow'
import DashboardTaxCalendar from './features/dashboard/DashboardTaxCalendar'

// Alerts
import AlertQueue        from './features/alerts/AlertQueue'
import CATemporaryAccess from './features/alerts/CATemporaryAccess'

// Settings
import SettingsPanel from './features/settings/SettingsPanel'

// Masters
import ChartOfAccounts from './features/masters/ChartOfAccounts'
import TaxMasters      from './features/masters/TaxMasters'
import CostCenters     from './features/masters/CostCenters'
import VoucherTypes    from './features/masters/VoucherTypes'
import OpeningBalances from './features/masters/OpeningBalances'
import Currencies      from './features/masters/Currencies'

// Parties
import AllParties      from './features/parties/AllParties'
import CustomerLedgers from './features/parties/CustomerLedgers'
import SupplierLedgers from './features/parties/SupplierLedgers'
import SharedLedger    from './features/parties/SharedLedger'
import Statements      from './features/parties/Statements'
import PartyReminders  from './features/parties/PartyReminders'
import NewReminder     from './features/parties/NewReminder'
import ReminderDetail  from './features/parties/ReminderDetail'
import PartyDocuments  from './features/parties/PartyDocuments'
import PartyPortal     from './features/parties/PartyPortal'
import PartyImport     from './features/parties/PartyImport'
import DuplicateMerge  from './features/parties/DuplicateMerge'
import CompetitorGap   from './features/parties/CompetitorGap'

// Inventory
import InventoryItems from './features/inventory/InventoryItems'
import NewInventoryItem from './features/inventory/NewInventoryItem'
import Godowns        from './features/inventory/Godowns'
import StockMovement  from './features/inventory/StockMovement'
import ItemPricing    from './features/inventory/ItemPricing'
import ReorderAlerts  from './features/inventory/ReorderAlerts'
import BatchSerials   from './features/inventory/BatchSerials'
import BarcodeLabels  from './features/inventory/BarcodeLabels'
import ItemImport     from './features/inventory/ItemImport'
import ItemGapAnalysis from './features/inventory/ItemGapAnalysis'

// Sales
import SalesInvoices    from './features/sales/SalesInvoices'
import Quotations       from './features/sales/Quotations'
import NewQuotation     from './features/sales/NewQuotation'
import ProformaInvoices from './features/sales/ProformaInvoices'
import SalesOrders      from './features/sales/SalesOrders'
import DeliveryChallans from './features/sales/DeliveryChallans'
import SalesReceipts    from './features/sales/Receipts'
import POSBilling       from './features/sales/POSBilling'
import RecurringInvoices from './features/sales/RecurringInvoices'

// Receivables
import MoneyInCenter from './features/receivables/MoneyInCenter'
import ARInvoices   from './features/receivables/ARInvoices'
import InvoicePaymentHistory from './features/receivables/InvoicePaymentHistory'
import Receipts     from './features/receivables/Receipts'
import RecordPayment from './features/receivables/RecordPayment'
import CreditNotes  from './features/receivables/CreditNotes'
import CreditNoteDetail from './features/receivables/CreditNoteDetail'
import NewCreditNote from './features/receivables/NewCreditNote'
import SalesReturns from './features/receivables/SalesReturns'
import SalesReturnDetail from './features/receivables/SalesReturnDetail'
import NewSalesReturn from './features/receivables/NewSalesReturn'
import Ageing       from './features/receivables/Ageing'
import Collections  from './features/receivables/Collections'
import ReminderTemplate from './features/receivables/ReminderTemplate'
import BulkReminderPreview from './features/receivables/BulkReminderPreview'
import CustomerStatements from './features/receivables/CustomerStatements'

// Purchase Operations
import PurchaseCenter   from './features/purchases/PurchaseCenter'
import PurchaseInvoices from './features/purchases/PurchaseInvoices'
import PaymentOut       from './features/purchases/PaymentOut'
import NewPayment       from './features/purchases/NewPayment'
import GoodsReceipt     from './features/purchases/GoodsReceipt'
import ReturnsDebitNotes from './features/purchases/ReturnsDebitNotes'
import PurchaseDocumentDetail from './features/purchases/PurchaseDocumentDetail'
import PurchaseReturns  from './features/purchases/PurchaseReturns'
import DebitNotes       from './features/purchases/DebitNotes'
import PurchaseOrders   from './features/purchases/PurchaseOrders'
import SupplierBills    from './features/purchases/SupplierBills'

// Payables
import Bills              from './features/payables/Bills'
import PaymentsOut        from './features/payables/PaymentsOut'
import LabourPayments     from './features/payables/LabourPayments'
import PayrollRequests    from './features/payables/PayrollRequests'
import APDebitNotes       from './features/payables/APDebitNotes'
import APPurchaseReturns  from './features/payables/APPurchaseReturns'
import APAgeing           from './features/payables/APAgeing'
import SupplierAdvances   from './features/payables/SupplierAdvances'
import MoneyOutWorkforce  from './features/payables/MoneyOutWorkforce'
import MoneyOutAdjustments from './features/payables/MoneyOutAdjustments'
import MoneyOutActionPage from './features/payables/MoneyOutActionPage'

// Cash & Bank
import BankAccounts  from './features/cashbank/BankAccounts'
import Reconciliation from './features/cashbank/Reconciliation'
import CashPettyCash from './features/cashbank/CashPettyCash'
import Contra        from './features/cashbank/Contra'
import ChequeRegister from './features/cashbank/ChequeRegister'
import BankStatementImport from './features/cashbank/BankStatementImport'
import AddBankAccount from './features/cashbank/AddBankAccount'
import TransferMoney from './features/cashbank/TransferMoney'

// Expenses & Journals
import ExpenseCenter  from './features/expenses/ExpenseCenter'
import Categories     from './features/expenses/Categories'
import AutomatedBills from './features/expenses/AutomatedBills'
import JournalVouchers from './features/expenses/JournalVouchers'
import Provisions     from './features/expenses/Provisions'
import WriteOffs      from './features/expenses/WriteOffs'
import PeriodClose    from './features/expenses/PeriodClose'
import ExpenseRulesRecurring from './features/expenses/ExpenseRulesRecurring'
import ExpenseAccounting from './features/expenses/ExpenseAccounting'
import ExpenseCloseControl from './features/expenses/ExpenseCloseControl'
import NewExpensePage from './features/expenses/NewExpensePage'
import ReceiptInboxPage from './features/expenses/ReceiptInboxPage'
import PolicyRulesPage from './features/expenses/PolicyRulesPage'
import ApprovalQueuePage from './features/expenses/ApprovalQueuePage'
import NewRulePage from './features/expenses/NewRulePage'
import NewAccountingEntryPage from './features/expenses/NewAccountingEntryPage'
import NewCategoryPage from './features/expenses/NewCategoryPage'
import NewRecurringBillPage from './features/expenses/NewRecurringBillPage'
import NewJournalVoucherPage from './features/expenses/NewJournalVoucherPage'
import NewProvisionPage from './features/expenses/NewProvisionPage'
import NewWriteOffPage from './features/expenses/NewWriteOffPage'
import ClosePeriodReviewPage from './features/expenses/ClosePeriodReviewPage'

// Tax Center
import GSTReturns          from './features/tax/GSTReturns'
import GSTReconciliation   from './features/tax/GSTReconciliation'
import EInvoicing          from './features/tax/EInvoicing'
import EWayBills           from './features/tax/EWayBills'
import TDS                 from './features/tax/TDS'
import TCS                 from './features/tax/TCS'
import TaxPayments         from './features/tax/TaxPayments'
import QuarterlyCompliance from './features/tax/QuarterlyCompliance'

// Fixed Assets
import AssetRegister       from './features/assets/AssetRegister'
import Depreciation        from './features/assets/Depreciation'
import DisposalRevaluation from './features/assets/DisposalRevaluation'

// Business Tools
import StaffPayroll  from './features/business/StaffPayroll'
import ManageUsers   from './features/business/ManageUsers'
import OnlineOrders  from './features/business/OnlineOrders'
import SMSMarketing  from './features/business/SMSMarketing'

// Storage
import ClientStorage       from './features/storage/ClientStorage'
import UnifiedTreeStorage  from './features/storage/UnifiedTreeStorage'

// Data Migration
import DataImport        from './features/migration/DataImport'
import DataExport        from './features/migration/DataExport'
import MigrationHistory  from './features/migration/MigrationHistory'

// Reports & Analytics
import FinancialStatements from './features/reports/FinancialStatements'
import Books               from './features/reports/Books'
import GSTReportsPage      from './features/reports/GSTReports'
import ARAP                from './features/reports/ARAP'
import Profitability       from './features/reports/Profitability'
import PeriodComparatives  from './features/reports/PeriodComparatives'
import BudgetVsActuals     from './features/reports/BudgetVsActuals'
import CashFlowProjection  from './features/reports/CashFlowProjection'
import ReportBuilder       from './features/reports/ReportBuilder'

/**
 * REAL_PAGES — flat map of 'sectionId/tabId' → Component.
 * To add a page: import the component, add the key here.
 */
const REAL_PAGES = {
  // Advanced Features
  'advanced-features/overview': AdvancedFeatures,

  // Dashboard
  'dashboard/overview':    DashboardOverview,
  'dashboard/cash-flow':   DashboardCashFlow,
  'dashboard/tax-calendar': DashboardTaxCalendar,

  // Alerts
  'alerts/accountant-alerts': () => <AlertQueue type="accountant" />,
  'alerts/compliance-alerts': () => <AlertQueue type="compliance" />,
  'alerts/cash-risk-alerts':  () => <AlertQueue type="risk" />,
  'alerts/ca-access':         CATemporaryAccess,

  // Settings
  'settings/company-profile': () => <SettingsPanel tab="company-profile" />,
  'settings/configuration':   () => <SettingsPanel tab="configuration"   />,
  'settings/fiscal-periods':  () => <SettingsPanel tab="fiscal-periods"  />,
  'settings/roles':           () => <SettingsPanel tab="roles"           />,
  'settings/integrations':    () => <SettingsPanel tab="integrations"    />,
  'settings/notifications':   () => <SettingsPanel tab="notifications"   />,
  'settings/audit-logs':      () => <SettingsPanel tab="audit-logs"      />,

  // Masters
  'masters/chart-of-accounts': ChartOfAccounts,
  'masters/tax-masters':       TaxMasters,
  'masters/cost-centers':      CostCenters,
  'masters/voucher-types':     VoucherTypes,
  'masters/opening-balances':  OpeningBalances,
  'masters/currencies':        Currencies,

  // Parties
  'parties/all-parties':      AllParties,
  'parties/customer-ledgers': CustomerLedgers,
  'parties/supplier-ledgers': SupplierLedgers,
  'parties/shared-ledger':    SharedLedger,
  'parties/statements':       Statements,
  'parties/reminders':        PartyReminders,
  'parties/documents':        PartyDocuments,
  'parties/portal':           PartyPortal,
  'parties/import':           PartyImport,
  'parties/gap-analysis':     CompetitorGap,

  // Party Tools
  'party-tools/documents':       PartyDocuments,
  'party-tools/portal':          PartyPortal,
  'party-tools/import':          PartyImport,
  'party-tools/duplicate-merge': DuplicateMerge,
  'party-tools/gap-analysis':    CompetitorGap,

  // Inventory
  'inventory/inventory-items': InventoryItems,
  'inventory/godowns':         Godowns,
  'inventory/stock-movement':  StockMovement,
  'inventory/item-pricing':    ItemPricing,
  'inventory/reorder-alerts':  ReorderAlerts,
  'inventory/batch-serials':   BatchSerials,
  'inventory/barcode-labels':  BarcodeLabels,
  'inventory/item-import':     ItemImport,
  'inventory/gap-analysis':    ItemGapAnalysis,

  // Item Tools
  'item-tools/reorder-alerts': ReorderAlerts,
  'item-tools/batch-serials':  BatchSerials,
  'item-tools/barcode-labels': BarcodeLabels,
  'item-tools/item-import':    ItemImport,
  'item-tools/gap-analysis':   ItemGapAnalysis,

  // Sales Operations
  'sales/sales-invoices':    SalesInvoices,
  'sales/quotations':        Quotations,
  'sales/proforma-invoices': ProformaInvoices,
  'sales/sales-orders':      SalesOrders,
  'sales/delivery-challans': DeliveryChallans,
  'sales/receipts':          SalesReceipts,
  'sales/pos-billing':       POSBilling,
  'sales/recurring-invoices': RecurringInvoices,

  // Receivables
  'receivables/money-in-center':     MoneyInCenter,
  'receivables/receivables':         ARInvoices,
  'receivables/payments-received':   Receipts,
  'receivables/overdue-collections': Collections,
  'receivables/credit-notes':        CreditNotes,
  'receivables/sales-returns':       SalesReturns,
  'receivables/customer-statements': CustomerStatements,

  // Purchase Operations
  'procurement/purchase-center':   PurchaseCenter,
  'procurement/purchase-orders':   PurchaseOrders,
  'procurement/goods-receipt':     GoodsReceipt,
  'procurement/purchase-invoices': PurchaseInvoices,
  'procurement/payment-out':       PaymentOut,
  'procurement/returns-debit-notes': ReturnsDebitNotes,
  'procurement/purchase-returns':  PurchaseReturns,
  'procurement/debit-notes':       DebitNotes,
  'procurement/supplier-bills':    SupplierBills,

  // Payables
  'payables/bills':             Bills,
  'payables/payments':          PaymentsOut,
  'payables/labour-payments':   LabourPayments,
  'payables/payroll-requests':  PayrollRequests,
  'payables/workforce':         MoneyOutWorkforce,
  'payables/adjustments':       MoneyOutAdjustments,
  'payables/bank-release':      () => <MoneyOutActionPage type="bank-batch" />,
  'payables/bank-batch':        () => <MoneyOutActionPage type="bank-batch" />,
  'payables/cheque-register':   () => <MoneyOutActionPage type="cheque-register" />,
  'payables/upi-queue':         () => <MoneyOutActionPage type="upi-queue" />,
  'payables/payment-advice':    () => <MoneyOutActionPage type="payment-advice" />,
  'payables/review-holds':      () => <MoneyOutActionPage type="review-holds" />,
  'payables/new-supplier-payment': () => <MoneyOutActionPage type="new-supplier-payment" />,
  'payables/vendor-portal':     () => <MoneyOutActionPage type="vendor-portal" />,
  'payables/debit-notes':       APDebitNotes,
  'payables/purchase-returns':  APPurchaseReturns,
  'payables/ageing':            APAgeing,
  'payables/supplier-advances': SupplierAdvances,

  // Cash & Bank
  'cashbank/bank-accounts':  BankAccounts,
  'cashbank/reconciliation': Reconciliation,
  'cashbank/cash-petty':     CashPettyCash,
  'cashbank/contra':         Contra,
  'cashbank/cheque-register': ChequeRegister,

  // Expenses & Journals
  'expenses/expense-center':   ExpenseCenter,
  'expenses/rules-recurring':  ExpenseRulesRecurring,
  'expenses/accounting':       ExpenseAccounting,
  'expenses/close-control':    ExpenseCloseControl,
  'expenses/categories':       Categories,
  'expenses/automated-bills':  AutomatedBills,
  'expenses/journal-vouchers': JournalVouchers,
  'expenses/provisions':       Provisions,
  'expenses/write-offs':       WriteOffs,
  'expenses/period-close':     PeriodClose,

  // Tax Center
  'tax/gst-returns':          GSTReturns,
  'tax/gst-reconciliation':   GSTReconciliation,
  'tax/e-invoicing':          EInvoicing,
  'tax/e-way-bills':          EWayBills,
  'tax/tds':                  TDS,
  'tax/tcs':                  TCS,
  'tax/tax-payments':         TaxPayments,
  'tax/quarterly-compliance': QuarterlyCompliance,
  'tax/ca-access':            CATemporaryAccess,

  // Fixed Assets
  'assets/asset-register':       AssetRegister,
  'assets/depreciation':         Depreciation,
  'assets/disposal-revaluation': DisposalRevaluation,

  // Business Tools
  'business-tools/staff-payroll': StaffPayroll,
  'business-tools/manage-users':  ManageUsers,
  'business-tools/online-orders': OnlineOrders,
  'business-tools/sms-marketing': SMSMarketing,

  // Storage
  'storage/client-storage':      ClientStorage,
  'storage/unifiedtree-storage': UnifiedTreeStorage,

  // Data Migration
  'migration/import':  DataImport,
  'migration/export':  DataExport,
  'migration/history': MigrationHistory,

  // Reports & Analytics
  'reports/financial-statements': FinancialStatements,
  'reports/books':                Books,
  'reports/gst-reports':          GSTReportsPage,
  'reports/ar-ap':                ARAP,
  'reports/profitability':        Profitability,
  'reports/period-comparatives':  PeriodComparatives,
  'reports/budget-vs-actuals':    BudgetVsActuals,
  'reports/cashflow-projection':  CashFlowProjection,
  'reports/report-builder':       ReportBuilder,
}

function makePage(section, tab) {
  const key = `${section.id}/${tab.id}`
  const Component = REAL_PAGES[key]
  if (Component) return <Component />
  return <PlaceholderPage section={section.label} tab={tab.label} />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard/overview" replace /> },
      ...sections.flatMap((section) =>
        section.tabs.map((tab) => ({
          path: `${section.id}/${tab.id}`,
          element: <RequireAccess sectionId={section.id}>{makePage(section, tab)}</RequireAccess>,
        }))
      ),
      ...sections.map((section) => ({
        path: section.id,
        element: <Navigate to={`/${section.id}/${section.tabs[0].id}`} replace />,
      })),

      // Settings routes — not in sidebar nav (accessed via gear icon), hardcoded here
      { path: 'parties/reminders/new', element: <RequireAccess sectionId="parties"><NewReminder /></RequireAccess> },
      { path: 'parties/reminders/:reminderId', element: <RequireAccess sectionId="parties"><ReminderDetail /></RequireAccess> },
      { path: 'inventory/inventory-items/new', element: <RequireAccess sectionId="inventory"><NewInventoryItem /></RequireAccess> },
      { path: 'sales/quotations/new', element: <RequireAccess sectionId="sales"><NewQuotation /></RequireAccess> },
      { path: 'receivables/receivables/:invoiceId', element: <RequireAccess sectionId="receivables"><InvoicePaymentHistory /></RequireAccess> },
      { path: 'receivables/payments-received/new', element: <RequireAccess sectionId="receivables"><RecordPayment /></RequireAccess> },
      { path: 'receivables/payments-received/:receiptId/edit', element: <RequireAccess sectionId="receivables"><RecordPayment /></RequireAccess> },
      { path: 'receivables/overdue-collections/reminders/send', element: <RequireAccess sectionId="receivables"><BulkReminderPreview /></RequireAccess> },
      { path: 'receivables/overdue-collections/:collectionId/reminder', element: <RequireAccess sectionId="receivables"><ReminderTemplate /></RequireAccess> },
      { path: 'receivables/credit-notes/new', element: <RequireAccess sectionId="receivables"><NewCreditNote /></RequireAccess> },
      { path: 'receivables/credit-notes/:creditNoteId', element: <RequireAccess sectionId="receivables"><CreditNoteDetail /></RequireAccess> },
      { path: 'receivables/sales-returns/new', element: <RequireAccess sectionId="receivables"><NewSalesReturn /></RequireAccess> },
      { path: 'receivables/sales-returns/gap-analysis', element: <Navigate to="/receivables/sales-returns" replace /> },
      { path: 'receivables/sales-returns/:returnId', element: <RequireAccess sectionId="receivables"><SalesReturnDetail /></RequireAccess> },
      { path: 'receivables/invoices', element: <Navigate to="/receivables/receivables" replace /> },
      { path: 'receivables/receipts', element: <Navigate to="/receivables/payments-received" replace /> },
      { path: 'receivables/ageing', element: <RequireAccess sectionId="receivables"><Ageing /></RequireAccess> },
      { path: 'receivables/collections', element: <Navigate to="/receivables/overdue-collections" replace /> },
      { path: 'procurement/payment-out/new', element: <RequireAccess sectionId="procurement"><NewPayment /></RequireAccess> },
      { path: 'procurement/purchase-orders/:docId', element: <RequireAccess sectionId="procurement"><PurchaseDocumentDetail kind="orders" /></RequireAccess> },
      { path: 'procurement/goods-receipt/:docId', element: <RequireAccess sectionId="procurement"><PurchaseDocumentDetail kind="grn" /></RequireAccess> },
      { path: 'procurement/purchase-invoices/:docId', element: <RequireAccess sectionId="procurement"><PurchaseDocumentDetail kind="invoices" /></RequireAccess> },
      { path: 'procurement/payment-out/:docId', element: <RequireAccess sectionId="procurement"><PurchaseDocumentDetail kind="payments" /></RequireAccess> },
      { path: 'procurement/returns-debit-notes/:docId', element: <RequireAccess sectionId="procurement"><PurchaseDocumentDetail kind="returns" /></RequireAccess> },
      { path: 'payables/labour-payments', element: <RequireAccess sectionId="payables"><LabourPayments /></RequireAccess> },
      { path: 'payables/payroll-requests', element: <RequireAccess sectionId="payables"><PayrollRequests /></RequireAccess> },
      { path: 'payables/supplier-advances', element: <RequireAccess sectionId="payables"><SupplierAdvances /></RequireAccess> },
      { path: 'payables/ageing', element: <RequireAccess sectionId="payables"><APAgeing /></RequireAccess> },
      { path: 'payables/debit-notes', element: <RequireAccess sectionId="payables"><APDebitNotes /></RequireAccess> },
      { path: 'payables/purchase-returns', element: <RequireAccess sectionId="payables"><APPurchaseReturns /></RequireAccess> },
      { path: 'payables/bank-batch', element: <RequireAccess sectionId="payables"><MoneyOutActionPage type="bank-batch" /></RequireAccess> },
      { path: 'payables/cheque-register', element: <RequireAccess sectionId="payables"><MoneyOutActionPage type="cheque-register" /></RequireAccess> },
      { path: 'payables/upi-queue', element: <RequireAccess sectionId="payables"><MoneyOutActionPage type="upi-queue" /></RequireAccess> },
      { path: 'payables/payment-advice', element: <RequireAccess sectionId="payables"><MoneyOutActionPage type="payment-advice" /></RequireAccess> },
      { path: 'payables/review-holds', element: <RequireAccess sectionId="payables"><MoneyOutActionPage type="review-holds" /></RequireAccess> },
      { path: 'payables/new-supplier-payment', element: <RequireAccess sectionId="payables"><MoneyOutActionPage type="new-supplier-payment" /></RequireAccess> },
      { path: 'payables/vendor-portal', element: <RequireAccess sectionId="payables"><MoneyOutActionPage type="vendor-portal" /></RequireAccess> },
      { path: 'cashbank/contra', element: <RequireAccess sectionId="cashbank"><Contra /></RequireAccess> },
      { path: 'cashbank/cheque-register', element: <RequireAccess sectionId="cashbank"><ChequeRegister /></RequireAccess> },
      { path: 'cashbank/import-statement', element: <RequireAccess sectionId="cashbank"><BankStatementImport /></RequireAccess> },
      { path: 'cashbank/accounts/new', element: <RequireAccess sectionId="cashbank"><AddBankAccount /></RequireAccess> },
      { path: 'cashbank/transfer', element: <RequireAccess sectionId="cashbank"><TransferMoney /></RequireAccess> },
      { path: 'expenses/categories', element: <RequireAccess sectionId="expenses"><Categories /></RequireAccess> },
      { path: 'expenses/automated-bills', element: <RequireAccess sectionId="expenses"><AutomatedBills /></RequireAccess> },
      { path: 'expenses/journal-vouchers', element: <RequireAccess sectionId="expenses"><JournalVouchers /></RequireAccess> },
      { path: 'expenses/provisions', element: <RequireAccess sectionId="expenses"><Provisions /></RequireAccess> },
      { path: 'expenses/write-offs', element: <RequireAccess sectionId="expenses"><WriteOffs /></RequireAccess> },
      { path: 'expenses/period-close', element: <RequireAccess sectionId="expenses"><PeriodClose /></RequireAccess> },
      { path: 'expenses/new-expense', element: <RequireAccess sectionId="expenses"><NewExpensePage /></RequireAccess> },
      { path: 'expenses/receipt-inbox', element: <RequireAccess sectionId="expenses"><ReceiptInboxPage /></RequireAccess> },
      { path: 'expenses/policy-rules', element: <RequireAccess sectionId="expenses"><PolicyRulesPage /></RequireAccess> },
      { path: 'expenses/approval-queue', element: <RequireAccess sectionId="expenses"><ApprovalQueuePage /></RequireAccess> },
      { path: 'expenses/new-rule', element: <RequireAccess sectionId="expenses"><NewRulePage /></RequireAccess> },
      { path: 'expenses/new-entry', element: <RequireAccess sectionId="expenses"><NewAccountingEntryPage /></RequireAccess> },
      { path: 'expenses/new-category', element: <RequireAccess sectionId="expenses"><NewCategoryPage /></RequireAccess> },
      { path: 'expenses/new-recurring-bill', element: <RequireAccess sectionId="expenses"><NewRecurringBillPage /></RequireAccess> },
      { path: 'expenses/new-journal-voucher', element: <RequireAccess sectionId="expenses"><NewJournalVoucherPage /></RequireAccess> },
      { path: 'expenses/new-provision', element: <RequireAccess sectionId="expenses"><NewProvisionPage /></RequireAccess> },
      { path: 'expenses/new-write-off', element: <RequireAccess sectionId="expenses"><NewWriteOffPage /></RequireAccess> },
      { path: 'expenses/close-period-action', element: <RequireAccess sectionId="expenses"><ClosePeriodReviewPage /></RequireAccess> },
      { path: 'settings',                    element: <Navigate to="/settings/company-profile" replace /> },
      { path: 'settings/company-profile',    element: <RequireAccess sectionId="settings"><SettingsPanel tab="company-profile" /></RequireAccess> },
      { path: 'settings/configuration',      element: <RequireAccess sectionId="settings"><SettingsPanel tab="configuration"   /></RequireAccess> },
      { path: 'settings/fiscal-periods',     element: <RequireAccess sectionId="settings"><SettingsPanel tab="fiscal-periods"  /></RequireAccess> },
      { path: 'settings/roles',              element: <RequireAccess sectionId="settings"><SettingsPanel tab="roles"           /></RequireAccess> },
      { path: 'settings/integrations',       element: <RequireAccess sectionId="settings"><SettingsPanel tab="integrations"    /></RequireAccess> },
      { path: 'settings/notifications',      element: <RequireAccess sectionId="settings"><SettingsPanel tab="notifications"   /></RequireAccess> },
      { path: 'settings/audit-logs',         element: <RequireAccess sectionId="settings"><SettingsPanel tab="audit-logs"      /></RequireAccess> },
    ],
  },
])

export default router
