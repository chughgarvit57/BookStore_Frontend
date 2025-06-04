import { useEffect, useState } from "react";
import styles from "./AddressForm.module.scss";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextareaAutosize,
  TextField,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import AddressType from "../../enums/AddressEnum";
import useAddress from "../../hooks/useAddress";
import SnackBar from "../../components/common/Snackbar/Snackbar";
import { validateAddress } from "../../utils/Validations";

const addressTypeMapping = {
  Home: AddressType.HOME,
  Work: AddressType.WORK,
  Other: AddressType.OTHER,
};

const addressTypeToString = {
  [AddressType.HOME]: "Home",
  [AddressType.WORK]: "Work",
  [AddressType.OTHER]: "Other",
};

const initialForm = {
  firstName: "",
  phoneNumber: "",
  address: "",
  city: "",
  state: "",
  locality: "",
  addressType: AddressType.HOME,
};

const AddressForm = ({ onContinue, setAddressOpen }) => {
  const { addAddress, fetchAddresses, deleteAddress } = useAddress();

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarData, setSnackBarData] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const showSnackbar = (message, severity = "error") =>
    setSnackBarData({ open: true, message, severity });

  const resetForm = () => {
    setFormData(initialForm);
    setErrors({});
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetchAddresses();
        setAddresses(res.data || []);
        if (!res.data?.length) setSelectedAddressId(null);
      } catch (err) {
        showSnackbar(err.message || "Failed to fetch addresses");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = ({ target: { name, value } }) => {
    let updatedValue = value;
    if (name === "addressType") {
      updatedValue = addressTypeMapping[value] || AddressType.HOME;
    }
    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateAddress(name, updatedValue),
    }));
  };

  const handleAddressSelection = (id) => {
    const selected = id === "new" ? null : id;
    setSelectedAddressId(selected);

    if (!selected) return resetForm();

    const addr = addresses.find((a) => String(a.addressId) === selected);
    if (addr) {
      setFormData({
        firstName: addr.firstName || "",
        phoneNumber: addr.phoneNumber || "",
        address: addr.address || "",
        city: addr.city || "",
        state: addr.state || "",
        locality: addr.locality || "",
        addressType: addr.addressType || AddressType.HOME,
      });
      setErrors({});
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      showSnackbar("Address deleted successfully", "success");
      const res = await fetchAddresses();
      setAddresses(res.data || []);
      if (selectedAddressId === id || !res.data?.length) {
        setSelectedAddressId(null);
        resetForm();
      }
    } catch (err) {
      showSnackbar(err.message || "Failed to delete address");
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    if (selectedAddressId !== null) {
      const selected = addresses.find(
        (a) => String(a.addressId) === selectedAddressId
      );
      if (selected && onContinue) {
        onContinue(selected);
        setAddressOpen(false);
        setSelectedAddressId(null);
        resetForm();
      }
      return;
    }

    const newErrors = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, validateAddress(k, v)])
    );
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      showSnackbar("Please fix the errors in the form.");
      return;
    }

    try {
      await addAddress({ formData });
      showSnackbar("Address saved successfully", "success");
      const res = await fetchAddresses();
      setAddresses(res.data || []);
      if (onContinue) {
        onContinue(formData);
        setAddressOpen(false);
        resetForm();
        setSelectedAddressId(null);
      }
    } catch (err) {
      showSnackbar(err.message || "Failed to save address. Please try again.");
    }
  };

  return (
    <>
      <div className={styles.addressSelectionContainer}>
        <h3>Select an Address</h3>
        {loading && <p>Loading addresses...</p>}
        {!loading && !addresses.length && (
          <p>No saved addresses found. Please add a new address below.</p>
        )}
        <RadioGroup
          value={selectedAddressId === null ? "new" : String(selectedAddressId)}
          onChange={(e) => handleAddressSelection(e.target.value)}
          className={styles.addressCardContainer}
        >
          {!loading &&
            addresses.map((addr) => (
              <div key={addr.addressId} className={styles.addressCard}>
                <FormControlLabel
                  value={String(addr.addressId)}
                  control={<Radio />}
                  label={
                    <div className={styles.addressCardContent}>
                      <div className={styles.addressType}>
                        {addressTypeToString[addr.addressType]}
                      </div>
                      <div className={styles.addressDetails}>
                        <p>
                          <strong>First Name:</strong> {addr.firstName}
                        </p>
                        <p>
                          <strong>Address:</strong> {addr.address}
                        </p>
                        <p>
                          <strong>City:</strong> {addr.city}
                        </p>
                        <p>
                          <strong>State:</strong> {addr.state}
                        </p>
                        <p>
                          <strong>Locality:</strong> {addr.locality}
                        </p>
                        <p>
                          <strong>Phone Number:</strong> {addr.phoneNumber}
                        </p>
                      </div>
                    </div>
                  }
                />
                <IconButton
                  onClick={() => handleDeleteAddress(addr.addressId)}
                  color="error"
                  size="small"
                  className={styles.deleteButton}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </div>
            ))}
          <FormControlLabel
            value="new"
            control={<Radio />}
            label="Add New Address"
            className={styles.newAddressOption}
          />
        </RadioGroup>
      </div>

      {selectedAddressId === null && (
        <form onSubmit={handleContinue}>
          <div className={styles.addressFormContainer}>
            <div className={styles.personalDetailsRow}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                fullWidth
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </div>
            <div className={styles.addressDetails}>
              <FormControl fullWidth error={!!errors.address}>
                <TextareaAutosize
                  placeholder="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  minRows={3}
                  className={styles.textarea}
                  aria-describedby="address-error-text"
                />
                {errors.address && (
                  <FormHelperText id="address-error-text">
                    {errors.address}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className={styles.cityStateRow}>
              <TextField
                label="City / Town"
                name="city"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                error={!!errors.city}
                helperText={errors.city}
              />
              <TextField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                fullWidth
                error={!!errors.state}
                helperText={errors.state}
              />
            </div>
            <TextField
              label="Locality"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              fullWidth
              error={!!errors.locality}
              helperText={errors.locality}
            />
            <div className={styles.typeSelection}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Type</FormLabel>
                <RadioGroup
                  row
                  name="addressType"
                  value={addressTypeToString[formData.addressType]}
                  onChange={handleChange}
                >
                  {["Home", "Work", "Other"].map((type) => (
                    <FormControlLabel
                      key={type}
                      value={type}
                      control={<Radio />}
                      label={type}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </form>
      )}

      <div className={styles.continueBtnContainer}>
        <button className={styles.continueBtn} onClick={handleContinue}>
          Continue
        </button>
      </div>

      <SnackBar
        open={snackbarData.open}
        onClose={() => setSnackBarData((prev) => ({ ...prev, open: false }))}
        message={snackbarData.message}
        severity={snackbarData.severity}
      />
    </>
  );
};

export default AddressForm;
