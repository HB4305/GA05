import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormField from './FormField';
import FormSelect from './FormSelect';

const ShippingForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            houseNumber: '',
            street: '',
            city: '',
            ward: '',
        },
    });

    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingWards, setLoadingWards] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Fetch provinces on mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch(
                    'https://raw.githubusercontent.com/vietmap-company/vietnam_administrative_address/main/admin_new/province.json'
                );
                const data = await response.json();
                setProvinces(Object.values(data));
            } catch (error) {
                console.error('Error fetching provinces:', error);
                setSubmitError('Failed to load provinces. Please refresh the page.');
            }
        };

        fetchProvinces();
    }, []);

    // Handle province change to fetch wards
    const handleProvinceChange = async (e) => {
        const provinceCode = e.target.value;
        setWards([]);
        setValue('ward', '');
        setSubmitError(null);

        if (!provinceCode) return;

        setLoadingWards(true);
        try {
            const res = await fetch(
                'https://raw.githubusercontent.com/vietmap-company/vietnam_administrative_address/main/admin_new/ward.json'
            );
            const data = await res.json();
            const wardArray = Object.values(data);
            const filteredWards = wardArray.filter((w) => w.parent_code === provinceCode);
            setWards(filteredWards);
        } catch (error) {
            console.error('Error fetching wards:', error);
            setSubmitError('Failed to load wards. Please try again.');
        } finally {
            setLoadingWards(false);
        }
    };

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);
            setSubmitSuccess(false);

            const cityName = provinces.find((p) => p.code === data.city)?.name;
            const wardName = wards.find((w) => w.code === data.ward)?.name;

            const finalResult = {
                houseNumber: data.houseNumber,
                street: data.street,
                city: cityName,
                ward: wardName,
            };

            console.log('=== SUBMITTED DATA ===');
            console.log(finalResult);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            setSubmitSuccess(true);
            alert(JSON.stringify(finalResult, null, 2));

            // Clear success message after 3 seconds
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitError('An error occurred while submitting the form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Shipping Address</h1>
                    <p className="text-slate-600">Enter your delivery details below</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                        {/* Error Alert */}
                        {submitError && (
                            <div className="rounded-md bg-red-50 border border-red-200 p-4">
                                <p className="text-sm font-medium text-red-800">{submitError}</p>
                            </div>
                        )}

                        {/* Success Alert */}
                        {submitSuccess && (
                            <div className="rounded-md bg-green-50 border border-green-200 p-4">
                                <p className="text-sm font-medium text-green-800">
                                    ✓ Shipping address saved successfully!
                                </p>
                            </div>
                        )}

                        {/* House Number and Street Row */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <FormField
                                label="House Number"
                                htmlFor="houseNumber"
                                error={errors.houseNumber}
                            >
                                <input
                                    id="houseNumber"
                                    type="text"
                                    placeholder="e.g., 123"
                                    {...register('houseNumber', {
                                        required: 'House number is required',
                                        minLength: {
                                            value: 1,
                                            message: 'House number must not be empty',
                                        },
                                    })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                />
                            </FormField>

                            <FormField
                                label="Street"
                                htmlFor="street"
                                error={errors.street}
                            >
                                <input
                                    id="street"
                                    type="text"
                                    placeholder="e.g., Main Street"
                                    {...register('street', {
                                        required: 'Street is required',
                                        minLength: {
                                            value: 2,
                                            message: 'Street must be at least 2 characters',
                                        },
                                    })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white text-slate-900 placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                />
                            </FormField>
                        </div>

                        {/* City / Province */}
                        <FormSelect
                            label="City / Province"
                            htmlFor="city"
                            error={errors.city}
                        >
                            <select
                                id="city"
                                {...register('city', {
                                    required: 'Please select a city',
                                    onChange: (e) => handleProvinceChange(e),
                                })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                                disabled={isSubmitting}
                            >
                                <option value="">-- Select a City --</option>
                                {provinces.map((prov) => (
                                    <option key={prov.code} value={prov.code}>
                                        {prov.name}
                                    </option>
                                ))}
                            </select>
                        </FormSelect>

                        {/* Ward */}
                        <FormSelect
                            label="Ward"
                            htmlFor="ward"
                            error={errors.ward}
                        >
                            <select
                                id="ward"
                                {...register('ward', {
                                    required: 'Please select a ward',
                                })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                                disabled={!wards.length || loadingWards || isSubmitting}
                            >
                                <option value="">
                                    {loadingWards ? '-- Loading wards --' : '-- Select a Ward --'}
                                </option>
                                {wards.map((w) => (
                                    <option key={w.code} value={w.code}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </FormSelect>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Confirming...' : 'Confirm Address'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShippingForm;