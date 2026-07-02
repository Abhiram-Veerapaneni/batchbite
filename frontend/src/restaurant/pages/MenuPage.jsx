import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
    getMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
} from "../services/RestaurantServices";

import MenuItemCard from "../components/MenuItemCard";
import MenuItemModal from "../components/MenuItemModal";

import "../styles/MenuPage.css";

function MenuPage() {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState("add");
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            setMenu(await getMenu());
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Failed to fetch menu.");
        } finally {
            setLoading(false);
        }
    };

    const filteredMenu = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return menu;

        return menu.filter(({ name, category, description }) =>
            [name, category, description]
                .filter(Boolean)
                .some(text => text.toLowerCase().includes(keyword))
        );
    }, [menu, search]);

    const handleAddClick = () => {
        setMode("add");
        setSelectedItem(null);
        setModalOpen(true);
    };

    const handleEditClick = item => {
        setMode("edit");
        setSelectedItem(item);
        setModalOpen(true);
    };

    const handleSubmit = async form => {
        try {
            if (mode === "add") {
                await addMenuItem(form);
                toast.success("Menu item added successfully.");
            } else {
                await updateMenuItem(selectedItem._id, form);
                toast.success("Menu item updated successfully.");
            }

            setModalOpen(false);
            fetchMenu();
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Failed to save menu item.");
        }
    };

    const handleDelete = async itemId => {
        try {
            await deleteMenuItem(itemId);
            toast.success("Menu item deleted.");
            fetchMenu();
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Failed to delete item.");
        }
    };

    const handleToggleAvailability = async ({ _id }) => {
        try {
            await toggleAvailability(_id);
            fetchMenu();
        } catch (error) {
            toast.error(error?.message || "Failed to update availability.");
        }
    };

    return (
        <div className="mp-page">
            <div className="mp-header">
                <div>
                    <h1 className="mp-title">Menu Management</h1>
                    <p className="mp-subtitle">Manage your restaurant menu items.</p>
                </div>

                <button className="mp-add-btn" onClick={handleAddClick}>
                    + Add Item
                </button>
            </div>

            <div className="mp-toolbar">
                <input
                    className="mp-search"
                    type="text"
                    placeholder="Search menu items..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="mp-loading">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="mp-loading-card" />
                    ))}
                </div>
            ) : filteredMenu.length === 0 ? (
                <div className="mp-empty">
                    <h3>No menu items found</h3>
                    <p>Try changing your search or add a new menu item.</p>
                </div>
            ) : (
                <div className="mp-list">
                    {filteredMenu.map(item => (
                        <MenuItemCard
                            key={item._id}
                            item={item}
                            onEdit={handleEditClick}
                            onDelete={() => handleDelete(item._id)}
                            onToggleAvailability={handleToggleAvailability}
                        />
                    ))}
                </div>
            )}

            <MenuItemModal
                mode={mode}
                isOpen={modalOpen}
                menuItem={selectedItem}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

export default MenuPage;