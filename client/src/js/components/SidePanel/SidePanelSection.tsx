import { SectionItems } from "./SidePanel";

type SectionProps = {
  title: string;
  items: SectionItems;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

function SidePanelSection({
  title,
  items,
  selected,
  setSelected,
  setCollapsed,
}: SectionProps) {
  return (
    <div className="panel-section">
      <p className="section-title">{title}</p>
      {items.map((item) => (
        <button
          className={`section-item ${selected === item.name && "selected"}`}
          key={item.name}
          onClick={() => {
            setCollapsed(true);
            setSelected(item.name);
            item.callback && item.callback();
          }}
        >
          {item.icon}
          <p>{item.name}</p>
        </button>
      ))}
    </div>
  );
}
export default SidePanelSection;
