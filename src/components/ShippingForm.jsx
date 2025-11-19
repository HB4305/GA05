import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const ShippingForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCity = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/vietmap-company/vietnam_administrative_address/main/admin_new/province.json');
            const data = await response.json();
            const provinceArray = Object.values(data);
            setProvinces(provinceArray);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu province:", error);
        }
    };

    useEffect(() => {
        fetchCity();
    }, []);

    const handleProvinceChange = async (e) => {
        const provinceCode = e.target.value;
        setWards([]);
        setValue("ward", "");

        if (provinceCode) {
            setLoading(true);
            try {
                const res = await fetch('https://raw.githubusercontent.com/vietmap-company/vietnam_administrative_address/main/admin_new/ward.json');
                const data = await res.json();
                const wardArray = Object.values(data);

                const filteredWards = wardArray.filter(w => w.parent_code === provinceCode);
                setWards(filteredWards);
            } catch (error) {
                console.error("Lỗi lấy dữ liệu ward:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const onSubmit = (data) => {
        const cityName = provinces.find(p => p.code == data.city)?.name;
        const wardName = wards.find(w => w.code == data.ward)?.name;

        const finalResult = {
            "House Number": data.houseNumber,
            "Street": data.street,
            "City": cityName,
            "Ward": wardName
        };

        console.log("=== DỮ LIỆU ĐÃ SUBMIT ===");
        console.log(finalResult);
        alert(JSON.stringify(finalResult, null, 2));
    };

    return (
        <div>
            <div>
                <h2>Shipping Form</h2>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div>
                        <div>
                            <label>House Number</label>
                            <input type="text" {...register("houseNumber")} />
                            {errors.houseNumber && <span>{errors.houseNumber.message}</span>}
                        </div>
                        <div>
                            <label>Street</label>
                            <input type="text" {...register("street")} />
                            {errors.street && <span>{errors.street.message}</span>}
                        </div>
                    </div>

                    <div>
                        <label>City / Province</label>
                        <select
                            {...register("city", {
                                onChange: (e) => handleProvinceChange(e)
                            })}
                        >
                            <option value="">-- Select City --</option>
                            {provinces.map((prov) => (
                                <option key={prov.code} value={prov.code}>{prov.name}</option>
                            ))}
                        </select>
                        {errors.city && <span>{errors.city.message}</span>}
                    </div>

                    <div>
                        <label>Ward</label>
                        <select
                            {...register("ward")}
                            disabled={!wards.length || loading}
                        >
                            <option value="">-- Select Ward --</option>
                            {wards.map((w) => (
                                <option key={w.code} value={w.code}>{w.name}</option>
                            ))}
                        </select>
                        {errors.ward && <span>{errors.ward.message}</span>}
                    </div>

                    <button type="submit">CONFIRM</button>
                </form>
            </div>
        </div>
    );
};

export default ShippingForm;