import React, { useState, useEffect } from 'react';
import Card from './Card';

interface RadioGridProps {
  selectedPermission: "manage_users" | "manage_suppliers";
  setSelectedPermission: (permission: "manage_users" | "manage_suppliers") => void;
}

const RadioGrid: React.FC<RadioGridProps> = ({ selectedPermission, setSelectedPermission }) => {
  const [selected, setSelected] = useState<string>(selectedPermission);

  useEffect(() => {
    setSelected(selectedPermission);
  }, [selectedPermission]);

  const items = [
    { label: 'Manage Users', id: 'manage_users' },
    { label: 'Manage Suppliers', id: 'manage_suppliers' },
  ];

  const handleChange = (value: string) => {
    setSelected(value);
    setSelectedPermission(value as "manage_users" | "manage_suppliers");
  };

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item, index) => (
        <Card
          key={index}
          selected={selected === item.id}
          onClick={() => handleChange(item.id)}
          className='w-[295px] h-[54px] cursor-pointer bg-[#EEEEEE] px-3 py-2 flex items-center rounded-[10px]'
        >
          <div className="flex items-center w-full justify-between">
            <span>{item.label}</span>
            <input
              type="radio"
              checked={selected === item.id}
              onChange={() => handleChange(item.id)}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RadioGrid;