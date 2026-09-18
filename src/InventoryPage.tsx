import { useEffect, useState } from 'react';
import { AuraBadge } from './components/AuraBadge';
import { AuraCell } from './components/AuraCell';
import { AuraHeader } from './components/AuraHeader';
import { AuraIconView } from './components/AuraIconView';
import { Icon } from './components/Icon';

const ASSET = `${import.meta.env.BASE_URL}assets/`;
const ACCEPTED_SHIPMENTS_KEY = 'inventory-prototype-accepted-shipments-v3';
const PROCESSED_RETURN_KITS_KEY = 'inventory-prototype-processed-return-kits-v3';
const LINKED_KIT_TASK_KEY = 'inventory-prototype-linked-kit-task-v5';

const navigation = [
  'nav-home.svg',
  'nav-user.svg',
  'nav-network.svg',
  'nav-map.svg',
  'nav-card.svg',
  'nav-bank.svg',
  'nav-transfer.svg',
  'nav-flow.svg',
  'nav-graduation.svg',
  'nav-mail.svg',
  'nav-search.svg',
  'nav-settings.svg',
];

type Kit = { count: number; label: string };
type Task = { name: string; kits: Kit[]; badge?: string; accent?: boolean };
type Shipment = {
  id: string;
  kit: string;
  kits: number;
  bolsas: number;
  badge: string;
  shippingDate: string;
  trackingNumber: string;
  icon: number;
};
type ModalStep = 'details' | 'confirm' | 'success' | null;
type ReturnKit = { id: number; type: '1-kit Crédito' | '2-kit Cuenta+Crédito' };
type ReturnAction = 'warehouse' | 'lost' | 'damaged';
type ToastState = { kind: 'return'; action: ReturnAction; count: number } | { kind: 'distribution'; count: number } | null;

const shipments: Shipment[] = [
  { id: '557093 – 557122', kit: '1-kit Crédito', kits: 300, bolsas: 30, badge: 'today', shippingDate: 'September 1', trackingNumber: '7797662678', icon: 1 },
  { id: '557123 – 557152', kit: '1-kit Crédito', kits: 300, bolsas: 30, badge: 'today', shippingDate: 'September 1', trackingNumber: '7797662679', icon: 2 },
  { id: '452306 – 557335', kit: '2-kit Cuenta+Crédito', kits: 300, bolsas: 30, badge: 'tomorrow', shippingDate: 'September 2', trackingNumber: '7797662680', icon: 3 },
  { id: '452336 – 557365', kit: '2-kit Cuenta+Crédito', kits: 300, bolsas: 30, badge: 'September 10', shippingDate: 'September 10', trackingNumber: '7797662681', icon: 4 },
  { id: '557153 – 557182', kit: '1-kit Crédito', kits: 300, bolsas: 30, badge: 'September 13', shippingDate: 'September 13', trackingNumber: '7797662682', icon: 5 },
  { id: '557183 – 557212', kit: '1-kit Crédito', kits: 300, bolsas: 30, badge: 'September 13', shippingDate: 'September 13', trackingNumber: '7797662683', icon: 6 },
];

const distributionTasks: Task[] = [
  { name: 'Carmen Ortega', kits: [{ count: 180, label: '1-kit Crédito' }, { count: 40, label: '2-kit Cuenta+Crédito' }], badge: 'today', accent: true },
  { name: 'Elena Castillo', kits: [{ count: 80, label: '1-kit Crédito' }, { count: 20, label: '2-kit Cuenta+Crédito' }], badge: 'today', accent: true },
  { name: 'Hugo Morales', kits: [{ count: 120, label: '1-kit Crédito' }, { count: 60, label: '2-kit Cuenta+Crédito' }], badge: 'until September 20' },
  { name: 'Mariana López', kits: [{ count: 150, label: '1-kit Crédito' }, { count: 50, label: '2-kit Cuenta+Crédito' }], badge: 'until September 21' },
  { name: 'Sofía Ramírez', kits: [{ count: 100, label: '1-kit Crédito' }, { count: 40, label: '2-kit Cuenta+Crédito' }], badge: 'until September 22' },
  { name: 'Diego Navarro', kits: [{ count: 140, label: '1-kit Crédito' }, { count: 30, label: '2-kit Cuenta+Crédito' }], badge: 'until September 23' },
  { name: 'Valeria Cruz', kits: [{ count: 90, label: '1-kit Crédito' }, { count: 20, label: '2-kit Cuenta+Crédito' }], badge: 'until September 24' },
];

const returnKits: ReturnKit[] = [
  { id: 327, type: '1-kit Crédito' },
  { id: 328, type: '1-kit Crédito' },
  { id: 329, type: '2-kit Cuenta+Crédito' },
  { id: 330, type: '1-kit Crédito' },
  { id: 331, type: '2-kit Cuenta+Crédito' },
  { id: 332, type: '1-kit Crédito' },
  { id: 333, type: '2-kit Cuenta+Crédito' },
  { id: 334, type: '1-kit Crédito' },
  { id: 335, type: '1-kit Crédito' },
  { id: 336, type: '2-kit Cuenta+Crédito' },
  { id: 337, type: '2-kit Cuenta+Crédito' },
  { id: 338, type: '1-kit Crédito' },
  { id: 339, type: '1-kit Crédito' },
  { id: 340, type: '2-kit Cuenta+Crédito' },
  { id: 341, type: '1-kit Crédito' },
  { id: 342, type: '2-kit Cuenta+Crédito' },
];

function TaskRow({ task, compact = false, onClick }: { task: Task; compact?: boolean; onClick?: () => void }) {
  return (
    <div
      className={`task-row${compact ? ' task-row--compact' : ''}${onClick ? ' task-row--interactive' : ''}`}
      onClick={onClick}
      onKeyDown={onClick ? (event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className="task-dot" aria-hidden="true" />
      <div className="task-name">{task.name}</div>
      <div className="kit-list">
        {task.kits.map((kit) => (
          <div className="kit-line" key={`${kit.count}-${kit.label}`}>
            <span className="kit-count">{kit.count}</span>
            <span className="muted">{kit.label}</span>
          </div>
        ))}
      </div>
      <div className="task-status">
        {task.badge && <AuraBadge accent={task.accent}>{task.badge}</AuraBadge>}
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <nav>
        {navigation.map((icon, index) => (
          <div className={`nav-item${index === 4 ? ' nav-item--active' : ''}`} key={icon}>
            <Icon src={`${ASSET}${icon}`} />
          </div>
        ))}
      </nav>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <h1>Inventory</h1>
        <div className="warehouse-select">
          <span>Pachuca Warehouse 1</span>
          <Icon src={`${ASSET}chevron-down.svg`} size={16} />
        </div>
        <div className="segments">
          <div className="segment segment--active">Overview</div>
          <div className="segment">Ambassadors</div>
          <div className="segment">Packs</div>
        </div>
      </div>
      <div className="topbar__right">
        <div className="search-field">
          <Icon src={`${ASSET}search.svg`} size={20} />
          <span>Search in inventory</span>
        </div>
        <button className="distribute-button" type="button">
          <span>Distribute</span>
          <Icon src={`${ASSET}button-chevron.svg`} size={20} />
        </button>
      </div>
    </header>
  );
}

function WarehouseSummary() {
  return (
    <div className="warehouse-summary">
      <div className="summary-card summary-card--stats">
        <div className="summary-stat">
          <span className="summary-label">Capacity</span>
          <strong>100</strong>
          <span>boxes</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-stat summary-stat--staff">
          <span className="summary-label">Staff <Icon src={`${ASSET}info.svg`} size={16} /></span>
          <strong>16</strong>
          <span>ambassadors</span>
        </div>
      </div>
      <div className="summary-card summary-card--contact">
        <span className="summary-label">Contact person</span>
        <strong>Diego Malagon</strong>
        <span>+52 998 274 6193</span>
      </div>
    </div>
  );
}

function InventoryWidgets() {
  return (
    <section className="inventory-widgets island">
      <div className="inventory-widget">
        <div>
          <div className="summary-label">1-kit Crédito</div>
          <div className="widget-values"><strong>3 216</strong><AuraBadge filled>+ 600 today</AuraBadge><AuraBadge>+ 600 later</AuraBadge></div>
        </div>
        <div className="card-preview" aria-label="1-kit Crédito card">
          <img className="card-preview__image" src={`${ASSET}card-light.png`} alt="" />
        </div>
      </div>
      <div className="inventory-widget">
        <div>
          <div className="summary-label">2-kit Cuenta+Crédito</div>
          <div className="widget-values"><strong>963</strong><AuraBadge filled>+ 600 tomorrow</AuraBadge><AuraBadge>+ 300 later</AuraBadge></div>
        </div>
        <div className="card-preview card-preview--account" aria-label="2-kit Cuenta+Crédito cards">
          <img className="card-preview__image card-preview__image--back" src={`${ASSET}card-light.png`} alt="" />
          <img className="card-preview__image card-preview__image--front" src={`${ASSET}card-dark.png`} alt="" />
        </div>
      </div>
    </section>
  );
}

function OnTheWay({ rows, onShipmentClick }: { rows: Shipment[]; onShipmentClick: (shipment: Shipment) => void }) {
  const today = rows.filter((shipment) => shipment.badge === 'today').length;
  const later = rows.length - today;
  const subtitle = `${today} ${today === 1 ? 'box' : 'boxes'} today, ${later} later`;
  return (
    <section className="island on-the-way">
      <AuraHeader title="Expected shipments" subtitle={subtitle} horizontal />
      <div className="section-divider" />
      <div className="on-the-way__list">
        {rows.map((shipment) => (
          <AuraCell
            key={shipment.id}
            icon={<AuraIconView src={`${ASSET}shipment-package-${shipment.icon}.svg`} />}
            title={shipment.id}
            description={`${shipment.kits} ${shipment.kit}`}
            accessory={<AuraBadge accent={shipment.badge === 'today'}>{shipment.badge}</AuraBadge>}
            onClick={() => onShipmentClick(shipment)}
          />
        ))}
      </div>
    </section>
  );
}

function TaskIsland({ title, subtitle, tasks, className = '', onTaskClick, isTaskInteractive }: { title: string; subtitle: string; tasks: Task[]; className?: string; onTaskClick?: (task: Task) => void; isTaskInteractive?: (task: Task) => boolean }) {
  return (
    <section className={`island task-island ${className}`}>
      <AuraHeader title={title} subtitle={subtitle} />
      <div className="section-divider" />
      <div className="task-list">
        {tasks.map((task) => {
          const interactive = Boolean(onTaskClick) && (isTaskInteractive ? isTaskInteractive(task) : true);
          return <TaskRow key={task.name} task={task} compact={task.kits.length === 1} onClick={interactive ? () => onTaskClick?.(task) : undefined} />;
        })}
      </div>
    </section>
  );
}

function ShipmentModal({ shipment, step, onClose, onStep, onConfirm }: { shipment: Shipment; step: Exclude<ModalStep, null>; onClose: () => void; onStep: (step: Exclude<ModalStep, null>) => void; onConfirm: () => void }) {
  const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();

  if (step === 'details') {
    return (
      <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
        <section className="shipment-modal" role="dialog" aria-modal="true" aria-labelledby="shipment-modal-title" onMouseDown={stopPropagation}>
          <header className="shipment-modal__header">
            <h2 id="shipment-modal-title">Check shipment</h2>
            <button className="modal-close modal-close--large" type="button" aria-label="Close" onClick={onClose}><Icon src={`${ASSET}modal-close.svg`} size={24} /></button>
          </header>
          <div className="shipment-modal__body">
            <div className="shipment-info">
              <div className="shipment-info__heading">
                <strong>{shipment.kit} box</strong>
                <span>{shipment.bolsas} bolsas / {shipment.kits} kits</span>
              </div>
              <dl className="shipment-details">
                <div><dt>Bolsa ID range</dt><dd>{shipment.id}</dd></div>
                <div><dt>Shipping date</dt><dd>{shipment.shippingDate}</dd></div>
                <div><dt>Tracking number</dt><dd>{shipment.trackingNumber}</dd></div>
              </dl>
              <button className="modal-button modal-button--secondary shipment-track" type="button">Track shipment <Icon src={`${ASSET}external-link.svg`} size={20} /></button>
            </div>
          </div>
          <footer className="shipment-modal__actions">
            <button className="modal-button modal-button--primary" type="button" onClick={() => onStep('confirm')}>Accept to warehouse</button>
            <button className="modal-button modal-button--secondary" type="button" onClick={onClose}>Cancel</button>
          </footer>
        </section>
      </div>
    );
  }

  const isSuccess = step === 'success';
  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <section className="dialog-modal" role="dialog" aria-modal="true" aria-labelledby="dialog-modal-title" onMouseDown={stopPropagation}>
        <div className="dialog-modal__content">
          <img className="dialog-modal__graphic" src={`${ASSET}${isSuccess ? 'success.png' : 'confirm-box.png'}`} alt="" />
          <h2 id="dialog-modal-title">{isSuccess ? <>Bolsas {shipment.id} accepted<br />to warehouse</> : <>Are you sure you have the box with<br />bolsas {shipment.id} physically?</>}</h2>
        </div>
        <div className="dialog-modal__actions">
          {isSuccess ? (
            <button className="modal-button modal-button--secondary" type="button" onClick={onClose}>Done</button>
          ) : (
            <>
              <button className="modal-button modal-button--primary" type="button" onClick={onConfirm}>Yes, accept to warehouse</button>
              <button className="modal-button modal-button--secondary" type="button" onClick={onClose}>Cancel</button>
            </>
          )}
        </div>
        {!isSuccess && <button className="modal-close" type="button" aria-label="Close" onClick={onClose}><Icon src={`${ASSET}modal-close.svg`} size={16} /></button>}
      </section>
    </div>
  );
}

function ScannerModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <section className="scanner-modal" role="dialog" aria-modal="true" aria-labelledby="scanner-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="scanner-modal__content">
          <img className="scanner-modal__graphic" src={`${ASSET}scanner-card.png`} alt="" />
          <div className="scanner-modal__copy">
            <h2 id="scanner-modal-title">Use scanner app</h2>
            <p>For kit distribution to ambassador use scanner app on<br />your mobile phone</p>
          </div>
        </div>
        <button className="scanner-modal__button" type="button" onClick={onClose}>Got it</button>
        <button className="scanner-modal__close" type="button" aria-label="Close" onClick={onClose}><Icon src={`${ASSET}scanner-close.svg`} size={16} /></button>
      </section>
    </div>
  );
}

function ReturnKitsDrawer({ kits, onClose, onProcess }: { kits: ReturnKit[]; onClose: () => void; onProcess: (ids: number[], action: ReturnAction) => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const visibleKits = kits.filter((kit) => `${kit.type} ${kit.id}`.toLowerCase().includes(query.toLowerCase()));
  const selectedKits = kits.filter((kit) => selected.has(kit.id));
  const selectedOne = selectedKits.filter((kit) => kit.type === '1-kit Crédito').length;
  const selectedTwo = selectedKits.length - selectedOne;

  const toggle = (id: number) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    const visibleIds = visibleKits.map((kit) => kit.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
    setSelected((current) => {
      const next = new Set(current);
      visibleIds.forEach((id) => allSelected ? next.delete(id) : next.add(id));
      return next;
    });
  };
  const process = (action: ReturnAction) => {
    if (!selected.size) return;
    const selectedIds = [...selected];
    setSelected(new Set());
    setMenuOpen(false);
    onProcess(selectedIds, action);
  };
  const allVisibleSelected = visibleKits.length > 0 && visibleKits.every((kit) => selected.has(kit.id));

  return (
    <div className="drawer-overlay" role="presentation" onMouseDown={onClose}>
      <section className="return-drawer" role="dialog" aria-modal="true" aria-labelledby="return-drawer-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="return-drawer__header">
          <h2 id="return-drawer-title">Get the kits back from fired ambassador</h2>
          <button className="drawer-close" type="button" aria-label="Close" onClick={onClose}><Icon src={`${ASSET}drawer-close.svg`} size={16} /></button>
        </header>

        <div className="return-drawer__content">
          <div className="ambassador-cell">
            <img src={`${ASSET}ambassador-avatar.svg`} alt="" />
            <span>Álvaro Molina</span>
          </div>
          <h3>Kits on hands</h3>
          <label className="kit-search">
            <span className="sr-only">Search kit or pack</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search kit or pack" />
          </label>
          <div className="kit-table">
            <div className="kit-table__header">
              <label className="kit-checkbox"><input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} /><span /></label>
              <span>Type</span><span>Pack ID</span><span>Kit barcode</span>
            </div>
            <div className="kit-table__body">
              {visibleKits.map((kit) => (
                <label className="kit-table__row" key={kit.id}>
                  <span className="kit-checkbox"><input type="checkbox" checked={selected.has(kit.id)} onChange={() => toggle(kit.id)} /><span /></span>
                  <span>{kit.type}</span><span>{kit.id}</span><button type="button">Show</button>
                </label>
              ))}
            </div>
          </div>
        </div>

        <footer className="return-drawer__footer">
          {selected.size > 0 && (
            <p className="selection-counter">
              {selectedOne > 0 && <><strong>{selectedOne}</strong><span>・1-kit Crédito</span></>}
              {selectedOne > 0 && selectedTwo > 0 && <span>, </span>}
              {selectedTwo > 0 && <><strong>{selectedTwo}</strong><span>・2-kit Cuenta+Crédito</span></>}
            </p>
          )}
          <div className="return-drawer__actions">
            <button className="drawer-action drawer-action--primary" type="button" disabled={!selected.size} onClick={() => process('warehouse')}>Move to warehouse</button>
            <div className="report-menu-wrap">
              {menuOpen && (
                <div className="report-menu" role="menu">
                  <button type="button" role="menuitem" onClick={() => process('lost')}>Lost</button>
                  <button type="button" role="menuitem" onClick={() => process('damaged')}>Damaged</button>
                </div>
              )}
              <button className="drawer-action drawer-action--secondary" type="button" disabled={!selected.size} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
                Report as <Icon src={`${ASSET}report-chevron.svg`} size={24} />
              </button>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}

function LinkedKitDrawer({ onClose, onDistribute, onLeave }: { onClose: () => void; onDistribute: () => void; onLeave: () => void }) {
  const linkedKits = Array.from({ length: 9 }, (_, index) => ({ id: index + 1, packId: 340, barcode: '2_100234830122' }));
  return (
    <div className="drawer-overlay" role="presentation" onMouseDown={onClose}>
      <section className="return-drawer linked-kits-drawer" role="dialog" aria-modal="true" aria-labelledby="linked-kits-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="return-drawer__header">
          <h2 id="linked-kits-title">Kit from warehouse was linked to the<br />client</h2>
          <button className="drawer-close" type="button" aria-label="Close" onClick={onClose}><Icon src={`${ASSET}drawer-close.svg`} size={16} /></button>
        </header>
        <div className="linked-kits-drawer__content">
          <div className="linked-summary">
            <div className="linked-summary__row"><img src={`${ASSET}linked-user.svg`} alt="" /><span>Álvaro Molina</span></div>
            <div className="linked-summary__row"><img src={`${ASSET}linked-kit.svg`} alt="" /><span>2-kit Cuenta+Crédito</span><span className="linked-summary__value">2_100234830122</span></div>
          </div>
          <h3>Kits in the same pack are still on warehouse</h3>
          <div className="linked-kit-table">
            <div className="linked-kit-table__row linked-kit-table__header"><span>Type</span><span>Pack ID</span><span>Kit barcode</span></div>
            {linkedKits.map((kit) => (
              <div className="linked-kit-table__row" key={kit.id}><span>2-kit Cuenta+Crédito</span><span>{kit.packId}</span><span>{kit.barcode}</span></div>
            ))}
          </div>
        </div>
        <footer className="linked-kits-drawer__footer">
          <button className="linked-drawer-action linked-drawer-action--primary" type="button" onClick={onDistribute}>Distribute kits to ambassador</button>
          <button className="linked-drawer-action linked-drawer-action--secondary" type="button" onClick={onLeave}>Leave on warehouse</button>
        </footer>
      </section>
    </div>
  );
}

function ActionToast({ toast, exiting, onClose }: { toast: Exclude<ToastState, null>; exiting: boolean; onClose: () => void }) {
  const noun = toast.count === 1 ? 'kit' : 'kits';
  const text = toast.kind === 'return'
    ? toast.action === 'warehouse'
      ? `${toast.count} ${noun} moved to warehouse`
      : `${toast.count} ${noun} reported as ${toast.action}`
    : null;
  return (
    <div className={`action-toast${exiting ? ' action-toast--exiting' : ''}`} role="status">
      <span className="action-toast__bar" />
      <strong>{toast.kind === 'distribution' ? <>{toast.count} {noun} distributed to Álvaro<br />Molina</> : text}</strong>
      <button type="button" aria-label="Close notification" onClick={onClose}><Icon src={`${ASSET}drawer-close.svg`} size={16} /></button>
    </div>
  );
}

export function InventoryPage() {
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(sessionStorage.getItem(ACCEPTED_SHIPMENTS_KEY) ?? '[]'));
    } catch {
      return new Set();
    }
  });
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [processedReturnKitIds, setProcessedReturnKitIds] = useState<Set<number>>(() => {
    try {
      return new Set(JSON.parse(sessionStorage.getItem(PROCESSED_RETURN_KITS_KEY) ?? '[]'));
    } catch {
      return new Set();
    }
  });
  const [returnDrawerOpen, setReturnDrawerOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [toastExiting, setToastExiting] = useState(false);
  const [linkedKitTaskResolved, setLinkedKitTaskResolved] = useState(() => sessionStorage.getItem(LINKED_KIT_TASK_KEY) === 'resolved');
  const [linkedKitDrawerOpen, setLinkedKitDrawerOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [allDistributionTasksVisible, setAllDistributionTasksVisible] = useState(false);

  const visibleShipments = shipments.filter((shipment) => !acceptedIds.has(shipment.id));
  const visibleReturnKits = returnKits.filter((kit) => !processedReturnKitIds.has(kit.id));
  const checkShipments = visibleShipments.filter((shipment) => shipment.badge === 'today');
  const checkShipmentTasks: Task[] = checkShipments.map((shipment) => ({
    name: shipment.id,
    kits: [{ count: shipment.kits, label: shipment.kit }],
    badge: 'expected today',
    accent: true,
  }));
  const checkShipmentSubtitle = checkShipments.length === 0
    ? 'No boxes are supposed to be on the warehouse'
    : `${checkShipments.length} ${checkShipments.length === 1 ? 'box is' : 'boxes are'} supposed to be on the warehouse`;

  const openShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setModalStep('details');
  };
  const closeModal = () => {
    setModalStep(null);
    setSelectedShipment(null);
  };
  const acceptShipment = () => {
    if (!selectedShipment) return;
    setAcceptedIds((current) => {
      const next = new Set(current).add(selectedShipment.id);
      sessionStorage.setItem(ACCEPTED_SHIPMENTS_KEY, JSON.stringify([...next]));
      return next;
    });
    setModalStep('success');
  };
  const processReturnKits = (ids: number[], action: ReturnAction) => {
    setProcessedReturnKitIds((current) => {
      const next = new Set(current);
      ids.forEach((id) => next.add(id));
      sessionStorage.setItem(PROCESSED_RETURN_KITS_KEY, JSON.stringify([...next]));
      if (next.size === returnKits.length) setReturnDrawerOpen(false);
      return next;
    });
    setToast({ kind: 'return', action, count: ids.length });
  };
  const resolveLinkedKitTask = (distribute: boolean) => {
    setLinkedKitTaskResolved(true);
    sessionStorage.setItem(LINKED_KIT_TASK_KEY, 'resolved');
    setLinkedKitDrawerOpen(false);
    if (distribute) setToast({ kind: 'distribution', count: 9 });
  };
  const dismissToast = () => {
    if (!toast || toastExiting) return;
    setToastExiting(true);
    window.setTimeout(() => setToast(null), 240);
  };

  useEffect(() => {
    if (!modalStep && !returnDrawerOpen && !linkedKitDrawerOpen && !scannerModalOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (modalStep) closeModal();
      if (returnDrawerOpen) setReturnDrawerOpen(false);
      if (linkedKitDrawerOpen) setLinkedKitDrawerOpen(false);
      if (scannerModalOpen) setScannerModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalStep, returnDrawerOpen, linkedKitDrawerOpen, scannerModalOpen]);

  useEffect(() => {
    if (!toast) return undefined;
    setToastExiting(false);
    const timeout = window.setTimeout(() => {
      setToastExiting(true);
      window.setTimeout(() => setToast(null), 240);
    }, 5000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <main className="prototype-frame">
      <div className="app-shell">
        <Sidebar />
        <div className="content">
          <Topbar />
          <div className="columns">
            <div className="left-column">
              <WarehouseSummary />
              <InventoryWidgets />
              <OnTheWay rows={visibleShipments} onShipmentClick={openShipment} />
            </div>
            <div className="right-column">
              <section className={`island task-island distribute-section${allDistributionTasksVisible ? ' distribute-section--expanded' : ''}`}>
                <AuraHeader title="Distribute kits" subtitle="2 ambassadors today, 5 later" />
                <div className="section-divider" />
                <div className="task-list">
                  {(allDistributionTasksVisible ? distributionTasks : distributionTasks.slice(0, 3)).map((task) => <TaskRow key={task.name} task={task} onClick={() => setScannerModalOpen(true)} />)}
                </div>
                <button className={`show-more${allDistributionTasksVisible ? ' show-more--expanded' : ''}`} type="button" onClick={() => setAllDistributionTasksVisible((visible) => !visible)}>
                  {allDistributionTasksVisible ? 'Show less' : 'Show 4 more'} <Icon src={`${ASSET}link-chevron.svg`} size={16} />
                </button>
              </section>
              {visibleReturnKits.length > 0 && (
                <TaskIsland
                  title="Get the kits back"
                  subtitle="1 fired ambassador with kits on hand"
                  tasks={[{ name: 'Álvaro Molina', kits: [{ count: visibleReturnKits.length, label: '1-kit Crédito' }] }]}
                  className="kits-back-section"
                  onTaskClick={() => setReturnDrawerOpen(true)}
                />
              )}
              <TaskIsland
                title="Check shipments"
                subtitle={checkShipmentSubtitle}
                tasks={checkShipmentTasks}
                className="shipments-section"
                onTaskClick={(task) => {
                  const shipment = checkShipments.find((item) => item.id === task.name);
                  if (shipment) openShipment(shipment);
                }}
              />
              <TaskIsland
                title="Check the kits"
                subtitle={linkedKitTaskResolved ? '1 task' : '2 tasks'}
                tasks={[
                  { name: 'Kits weren’t moved from warehouse too long', kits: [{ count: 563, label: '1-kit Crédito' }, { count: 316, label: '2-kit Cuenta+Crédito' }] },
                  ...(!linkedKitTaskResolved ? [{ name: 'Kit from warehouse was linked to the client', kits: [{ count: 1, label: '1-kit Crédito' }], badge: 'today', accent: true }] : []),
                ]}
                className="check-kits-section"
                isTaskInteractive={(task) => task.name === 'Kit from warehouse was linked to the client'}
                onTaskClick={() => setLinkedKitDrawerOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
      {selectedShipment && modalStep && (
        <ShipmentModal
          shipment={selectedShipment}
          step={modalStep}
          onClose={closeModal}
          onStep={setModalStep}
          onConfirm={acceptShipment}
        />
      )}
      {scannerModalOpen && <ScannerModal onClose={() => setScannerModalOpen(false)} />}
      {returnDrawerOpen && visibleReturnKits.length > 0 && (
        <ReturnKitsDrawer kits={visibleReturnKits} onClose={() => setReturnDrawerOpen(false)} onProcess={processReturnKits} />
      )}
      {linkedKitDrawerOpen && !linkedKitTaskResolved && (
        <LinkedKitDrawer onClose={() => setLinkedKitDrawerOpen(false)} onDistribute={() => resolveLinkedKitTask(true)} onLeave={() => resolveLinkedKitTask(false)} />
      )}
      {toast && <ActionToast toast={toast} exiting={toastExiting} onClose={dismissToast} />}
    </main>
  );
}
