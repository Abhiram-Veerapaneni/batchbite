import { useEffect, useState } from "react";

import "../styles/MenuItemModal.css";

const initialForm = {
    name: "",
    description: "",
    image: null,
    price: "",
    category: "",
    isVeg: true,
    isAvailable: true
};

function MenuItemModal({
    mode,
    isOpen,
    onClose,
    onSubmit,
    menuItem = null
}) {

    const isEdit = mode === "edit";

    const [form, setForm] = useState(initialForm);
    const [preview, setPreview] = useState("");

    useEffect(() => {

        if (!isOpen) return;

        if (!isEdit || !menuItem) {

            setForm(initialForm);
            setPreview("");

            return;
        }

        setForm({
            name: menuItem.name,
            description: menuItem.description,
            image: null,
            price: menuItem.price,
            category: menuItem.category,
            isVeg: menuItem.isVeg,
            isAvailable: menuItem.isAvailable
        });

        setPreview(menuItem.image);

    }, [isOpen, isEdit, menuItem]);

    useEffect(() => {

        return () => {

            if (preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }

        };

    }, [preview]);

    const handleChange = (e) => {

        const { name, value, checked, type } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox"
                ? checked
                : value
        }));

    };

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        if (preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }

        setForm(prev => ({
            ...prev,
            image: file
        }));

        setPreview(
            URL.createObjectURL(file)
        );

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(form);

    };

    if (!isOpen) return null;

    return (

        <div className="mim-overlay">

            <div className="mim-modal">

                <div className="mim-header">

                    <h2>
                        {isEdit
                            ? "Edit Menu Item"
                            : "Add Menu Item"}
                    </h2>

                    <button
                        className="mim-close"
                        onClick={onClose}
                        type="button"
                    >
                        ✕
                    </button>

                </div>

                <form
                    className="mim-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Item Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        rows="3"
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <div className="mim-upload">

                        <label className="mim-upload-label">

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleImageChange}
                                hidden
                            />

                            {preview ? (

                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="mim-preview"
                                />

                            ) : (

                                <div className="mim-upload-placeholder">

                                    <span className="mim-upload-icon">
                                        📷
                                    </span>

                                    <strong>
                                        Click to upload
                                    </strong>

                                    <small>
                                        JPG • PNG • WEBP
                                    </small>

                                </div>

                            )}

                        </label>

                        {preview && (

                            <label className="mim-change-image">

                                Change Image

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleImageChange}
                                    hidden
                                />

                            </label>

                        )}
                    </div>
                                        <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />

                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={form.category}
                        onChange={handleChange}
                        required
                    />

                    <label className="mim-checkbox">

                        <input
                            type="checkbox"
                            name="isVeg"
                            checked={form.isVeg}
                            onChange={handleChange}
                        />

                        Vegetarian

                    </label>

                    <label className="mim-checkbox">

                        <input
                            type="checkbox"
                            name="isAvailable"
                            checked={form.isAvailable}
                            onChange={handleChange}
                        />

                        Available

                    </label>

                    <div className="mim-actions">

                        <button
                            type="button"
                            className="mim-btn mim-btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="mim-btn mim-btn-primary"
                        >
                            {isEdit
                                ? "Save Changes"
                                : "Add Item"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default MenuItemModal;