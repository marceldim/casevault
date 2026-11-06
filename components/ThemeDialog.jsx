'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { useTheme } from "next-themes"; // ADD

export default function ThemeDialog({ open, onClose }) {

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            slotProps={{
                sx: {
                    borderRadius: { xs: "16px", sm: "24px" },
                    padding: { xs: "10px 10px", sm: "20px 16px" },
                    width: "100%",
                    maxWidth: { xs: "78%", sm: "360px" },
                    margin: "auto",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                }
            }}
        >

            <DialogTitle
                sx={{
                    fontSize: { xs: "1.1rem", sm: "1.6rem" },
                    fontWeight: 600,
                    padding: { xs: "8px 6px 12px", sm: "8px 8px 16px" },
                    color: "text.primary"
                }}
            >
                Theme
            </DialogTitle>

            <DialogContent sx={{ padding: { xs: "0 6px", sm: "0 8px" } }}>
                <RadioGroup
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                >

                    <FormControlLabel
                        value="system"
                        control={<Radio sx={{ transform: "scale(1.1)" }} />}
                        label="System (Default)"
                        sx={{
                            marginBottom: { xs: "5px", sm: "7px" },
                            color: "text.primary",
                            fontWeight: 800,
                        }}
                    />

                    <FormControlLabel
                        value="light"
                        control={<Radio sx={{ transform: "scale(1.1)" }} />}
                        label="Light"
                        sx={{
                            marginBottom: { xs: "5px", sm: "7px" },
                            color: "text.primary",
                            fontWeight: 800,
                        }}
                    />

                    <FormControlLabel
                        value="dark"
                        control={<Radio sx={{ transform: "scale(1.1)" }} />}
                        label="Dark"
                        sx={{
                            color: "text.primary",
                            fontWeight: 800,
                        }}
                    />

                </RadioGroup>

                <div className="flex justify-end sm:mt-8 pr-1">
                    <Button
                        onClick={onClose}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.80rem",
                            color: "text.primary",
                        }}
                    >
                        OK
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}