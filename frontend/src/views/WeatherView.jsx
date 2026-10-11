import React from 'react';
import { CloudSun, Sun, CloudRain, Wind, Droplets, Compass, Thermometer, ShieldCheck } from 'lucide-react';

export default function WeatherView({ farmId }) {
  const forecast = [
    { day: 'Today', temp: '29°C / 22°C', condition: 'Sunny / Clear', rainProb: '10%', icon: Sun },
    { day: 'Tomorrow', temp: '30°C / 23°C', condition: 'Partly Cloudy', rainProb: '15%', icon: CloudSun },
    { day: 'Wednesday', temp: '28°C / 21°C', condition: 'Light Showers', rainProb: '45%', icon: CloudRain },
    { day: 'Thursday', temp: '27°C / 20°C', condition: 'Overcast Skies', rainProb: '30%', icon: CloudSun },
    { day: 'Friday', temp: '31°C / 22°C', condition: 'Clear Sun', rainProb: '5%', icon: Sun },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '24px 32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Agro-Meteorology & Weather Advisory
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Hyperlocal weather station telemetry, evapotranspiration indices and precision irrigation advisories
        </p>
      </div>

      {/* Main Weather Hero Card */}
      <div style={{
        background: 'linear-gradient(135deg, #072e21 0%, #0d4633 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sun size={44} color="#facc15" />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 600 }}>
              Live Field Weather Station • Pollachi Taluk, Coimbatore
            </span>
            <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              29°C
            </div>
            <p style={{ fontSize: '0.9rem', color: '#a7f3d0', marginTop: '4px' }}>
              Sunny & Clear • Evapotranspiration: 4.8 mm/day
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#a7f3d0' }}>Relative Humidity</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>68%</div>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#a7f3d0' }}>Wind Speed</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>12 km/h (SW)</div>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#a7f3d0' }}>Solar Radiation</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>820 W/m²</div>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#a7f3d0' }}>Dew Point</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>21.4°C</div>
          </div>
        </div>
      </div>

      {/* Advisory Card */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShieldCheck size={20} color="#059669" />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#065f46' }}>
            Daily Irrigation & Spraying Advisory
          </h3>
        </div>
        <p style={{ fontSize: '0.86rem', color: '#047857', lineHeight: 1.5 }}>
          Atmospheric conditions are ideal for morning drip irrigation until 10:00 AM. Wind speeds are low (12 km/h), making the period between 06:30 AM to 09:30 AM optimal for drone foliar spraying on Field 1 without pesticide drift. Rain probability increases slightly on Wednesday (45%), so heavy tractor rotavation should be concluded prior to midweek.
        </p>
      </div>

      {/* 5-Day Forecast Grid */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)' }}>
          5-Day Agricultural Forecast
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px'
        }}>
          {forecast.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="card" style={{ padding: '18px', textAlign: 'center' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{f.day}</strong>
                <div style={{ margin: '12px auto', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={32} color={f.day === 'Wednesday' ? '#3b82f6' : '#f59e0b'} />
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>{f.temp}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>{f.condition}</div>
                <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600, marginTop: '6px' }}>
                  Rain: {f.rainProb}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
