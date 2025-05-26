document.addEventListener('DOMContentLoaded', () => {
    // --- Bagian Navigasi Halaman ---
    const pageSections = document.querySelectorAll('.page-section');
    const navButtons = document.querySelectorAll('.nav-button');
    let userAnswersPendahuluan = {};
    let userAnswersEvaluasi = {}; // Untuk menyimpan jawaban kuis evaluasi
    let simulationInitialized = false;

    const tombolLanjutKeMateri = document.getElementById('tombolLanjutKeMateri');

    function showPage(targetId) {
        pageSections.forEach(section => {
            if (section.id === targetId) {
                section.classList.remove('hidden');
                if (targetId === 'bagian-simulasi' && !simulationInitialized) {
                    initializeSimulation();
                    simulationInitialized = true;
                }
            } else {
                section.classList.add('hidden');
            }
        });
        window.scrollTo(0, 0);
    }

    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            if (event.target.dataset.target) {
                const targetId = event.target.dataset.target;
                showPage(targetId);
            }
        });
    });

    if (pageSections.length > 0) {
        showPage('bagian-soal-pendahuluan');
    }

    // --- Fungsi untuk Kuis Pendahuluan ---
    window.kumpulkanJawabanPendahuluan = function() {
        const form = document.getElementById('quizFormPendahuluan');
        const hasilQuizPendahuluanDiv = document.getElementById('hasilQuizPendahuluan');
        const tombolLihatKunci = document.getElementById('tombolLihatKunciPendahuluan');

        if (form && hasilQuizPendahuluanDiv) {
            const formData = new FormData(form);
            userAnswersPendahuluan = {};
            for (let [name, value] of formData.entries()) {
                userAnswersPendahuluan[name] = value;
            }

            const kunciJawabanPendahuluan = {
                q1_pendahuluan: 'c', q2_pendahuluan: 'b', q3_pendahuluan: 'c',
                q4_pendahuluan: 'c', q5_pendahuluan: 'a'
            };

            let htmlHasil = "<h4>Kunci Jawaban & Hasil:</h4>";
            let semuaBenar = true;
            let adaYangBelumDiisi = false;
            let jumlahSoalPendahuluan = Object.keys(kunciJawabanPendahuluan).length;

            for (let i = 1; i <= jumlahSoalPendahuluan; i++) {
                const soalId = `q${i}_pendahuluan`;
                const jawabanUser = userAnswersPendahuluan[soalId];
                const jawabanBenar = kunciJawabanPendahuluan[soalId];

                htmlHasil += `<p><strong>Soal ${i}:</strong> `;
                if (jawabanUser) {
                    htmlHasil += `Jawaban Anda: ${jawabanUser}. Kunci: ${jawabanBenar}. `;
                    if (jawabanUser === jawabanBenar) {
                        htmlHasil += `<span style="color: green; font-weight:bold;">Benar!</span></p>`;
                    } else {
                        htmlHasil += `<span style="color: red; font-weight:bold;">Salah.</span></p>`;
                        semuaBenar = false;
                    }
                } else {
                    htmlHasil += `Kunci: ${jawabanBenar}. <span style="color: orange; font-weight:bold;">Belum dijawab.</span></p>`;
                    adaYangBelumDiisi = true;
                    semuaBenar = false; // Anggap salah jika belum diisi untuk lanjut
                }
            }
            hasilQuizPendahuluanDiv.innerHTML = htmlHasil;
            hasilQuizPendahuluanDiv.classList.remove('hidden'); // Tampilkan hasil

            if (tombolLanjutKeMateri) {
                tombolLanjutKeMateri.classList.remove('hidden'); // Tampilkan tombol "Lanjut ke Materi"
            }
            if(tombolLihatKunci) {
                tombolLihatKunci.classList.add('hidden'); // Sembunyikan tombol "Lihat Kunci Jawaban"
            }
        }
    }

    // --- Fungsi untuk Kuis Evaluasi ---
    window.kumpulkanJawabanEvaluasi = function() {
        const form = document.getElementById('quizFormEvaluasi');
        if (form) {
            const formData = new FormData(form);
            userAnswersEvaluasi = {};
            for (let [name, value] of formData.entries()) {
                userAnswersEvaluasi[name] = value;
            }
            generatePembahasanEvaluasi(); // Panggil fungsi untuk membuat dan menampilkan pembahasan evaluasi
        }
        // Navigasi ke halaman pembahasan evaluasi akan dihandle oleh tombol "Lihat Pembahasan Evaluasi"
    }

    function generatePembahasanEvaluasi() {
        const pembahasanContent = document.getElementById('pembahasanContentEvaluasi');
        if (!pembahasanContent) return;

        const kunciJawabanEvaluasi = {
            q1_evaluasi: 'd', q2_evaluasi: 'c', q3_evaluasi: 'c',
            q4_evaluasi: 'c', q5_evaluasi: 'a'
        };
        const penjelasanSoalEvaluasi = {
            q1_evaluasi: "Energi kinetik maksimum elektron diperoleh saat foton kehilangan energi paling banyak, yaitu ketika perubahan panjang gelombangnya (\\(\\Delta\\lambda\\)) maksimum. Ini terjadi saat \\(\\cos\\theta = -1\\), yaitu \\(\\theta=180^\\circ\\), yang berarti foton dipantulkan kembali (backscattering).",
            q2_evaluasi: "Panjang gelombang foton bertambah karena sebagian energi dan momentumnya ditransfer ke elektron. Karena energi berkurang, maka frekuensi foton juga berkurang (ingat \\(E=hf\\)). Penurunan frekuensi menyebabkan peningkatan panjang gelombang, karena \\(\\lambda=c/f\\). Jadi, panjang gelombang foton setelah hamburan menjadi lebih besar dibandingkan sebelum tumbukan.",
            q3_evaluasi: "Hubungan antara sudut hamburan foton (\\(\\theta\\)) dan perubahan panjang gelombang (\\(\\Delta\\lambda\\)) adalah: \\( \\Delta\\lambda = \\lambda' - \\lambda = \\frac{h}{m_e c}(1 - \\cos\\theta) \\) Berdasarkan persamaan tersebut: Saat \\(\\theta=0^\\circ\\), maka \\(\\cos \\theta=1\\), sehingga \\(\\Delta\\lambda=0\\) → tidak ada perubahan panjang gelombang. Saat \\(\\theta\\) meningkat menuju \\(180^\\circ\\), \\(\\cos \\theta\\) menurun dari 1 ke -1, sehingga \\(\\Delta\\lambda\\) menjadi semakin besar.",
            q4_evaluasi: "Dalam efek Compton, foton menumbuk elektron bebas. Tumbukan terjadi secara elastis. Setelah tumbukan, foton akan kehilangan sebagian energi dan momentum. Energi tersebut ditransfer ke elektron, akibatnya elektron terdorong dan bergerak dengan kecepatan tertentu (hasil dari tumbukan).",
            q5_evaluasi: "Diketahui: \\(\\lambda = 0,070 \\text{ nm}\\), \\(\\theta = 90^\\circ\\). Ditanya: \\(\\lambda'\\) = …? Penyelesaian: Gunakan persamaan \\(\\Delta\\lambda = \\frac{h}{m_e c}(1 - \\cos\\theta)\\). Dengan \\(h/(m_e c) \\approx 0,00243 \\text{ nm}\\) (panjang gelombang Compton elektron) dan \\(\\cos 90^\\circ = 0\\), maka \\(\\Delta\\lambda = 0,00243 \\text{ nm} (1 - 0) = 0,00243 \\text{ nm}\\). Maka \\(\\lambda' = \\Delta\\lambda + \\lambda = 0,00243 \\text{ nm} + 0,070 \\text{ nm} = 0,07243 \\text{ nm}\\)."
        };

        let htmlPembahasan = "<h3>Kunci Jawaban & Pembahasan Soal Evaluasi:</h3>";
        for (const soalId in kunciJawabanEvaluasi) {
            const jawabanUser = userAnswersEvaluasi[soalId] || "Tidak dijawab";
            const jawabanBenar = kunciJawabanEvaluasi[soalId];
            let nomorSoal = soalId.replace('q', '').replace('_evaluasi', '');

            htmlPembahasan += `<p><strong>Soal ${nomorSoal}:</strong> Jawaban Anda: ${jawabanUser}. `;
            if (jawabanUser === jawabanBenar) {
                htmlPembahasan += `<span style="color: green; font-weight:bold;">Benar!</span></p>`;
            } else {
                htmlPembahasan += `<span style="color: red; font-weight:bold;">Salah.</span> Jawaban yang benar: ${jawabanBenar}.</p>`;
            }
            if (penjelasanSoalEvaluasi[soalId]) {
                 htmlPembahasan += `<p class="penjelasan">${penjelasanSoalEvaluasi[soalId]}</p>`;
            }
        }
        pembahasanContent.innerHTML = htmlPembahasan;

        // Beritahu MathJax untuk merender ulang konten yang baru ditambahkan
        if (typeof MathJax !== "undefined" && MathJax.typeset) {
            MathJax.typesetPromise([pembahasanContent]).catch(function (err) {
                console.error('MathJax typesetting error for evaluation: ' + err.message);
            });
        }
    }


    // --- Bagian Inisialisasi dan Logika SIMULASI (Sama seperti versi terakhir yang berfungsi baik) ---
    // ... (Seluruh kode initializeSimulation, hitungDanVisualisasikan_sim_function, draw..., animate... tetap sama) ...
    // Pastikan semua variabel dan fungsi simulasi menggunakan akhiran _sim jika diperlukan untuk menghindari konflik

    let lambdaInputElement_sim, thetaInputFotonElement_sim, thetaValueFotonElement_sim, tombolHitungElement_sim;
    let lambdaDatangDisplayElement_sim, deltaLambdaElement_sim, lambdaFinalElement_sim, EdatangElement_sim, EakhirElement_sim, KelectronElement_sim, thetaFotonDisplayElement_sim, phiElectronDisplayElement_sim;
    let canvas_sim, ctx_sim;

    const h_planck_sim = 6.626e-34;
    const c_light_sim = 3.00e8;
    const m_e_sim = 9.109e-31;
    const q_e_joule_per_ev_sim = 1.602e-19;
    const joule_to_keV_factor_sim = 1 / (q_e_joule_per_ev_sim * 1000);
    const pm_to_m_factor_sim = 1e-12;
    const comptonWavelength_m_sim = h_planck_sim / (m_e_sim * c_light_sim);

    let animationId_sim = null;
    let incomingPhoton_sim = { x: 0, y: 0, active: false, speed: 3, phaseOffset: 0 };
    let scatteredPhoton_sim = { x: 0, y: 0, angleRad_canvas: 0, active: false, speed: 4, color: 'blue' };
    let recoiledElectron_sim = { x: 0, y: 0, angleRad_canvas: 0, active: false, speed: 2, color: 'red' };
    let currentThetaFotonRad_math_sim = 0;
    let currentPhiElectronRad_math_sim = 0;
    let collisionOccurred_sim = false;

    let interactionPointX_sim, interactionPointY_sim;
    let targetPlateX_sim, targetPlateY_sim, targetPlateWidth_sim, targetPlateHeight_sim;
    const photonRadius_sim = 5;
    const electronVisualRadius_sim = 8;

    function initializeSimulation() {
        lambdaInputElement_sim = document.getElementById('lambdaInput');
        thetaInputFotonElement_sim = document.getElementById('thetaInputFoton');
        thetaValueFotonElement_sim = document.getElementById('thetaValueFoton');
        tombolHitungElement_sim = document.getElementById('tombolHitung');
        lambdaDatangDisplayElement_sim = document.getElementById('lambdaDatangDisplay');
        deltaLambdaElement_sim = document.getElementById('deltaLambda');
        lambdaFinalElement_sim = document.getElementById('lambdaFinal');
        EdatangElement_sim = document.getElementById('Edatang');
        EakhirElement_sim = document.getElementById('Eakhir');
        KelectronElement_sim = document.getElementById('Kelectron');
        thetaFotonDisplayElement_sim = document.getElementById('thetaFotonDisplay');
        phiElectronDisplayElement_sim = document.getElementById('phiElectronDisplay');
        canvas_sim = document.getElementById('comptonCanvas');

        if (!canvas_sim) { console.error("Elemen canvas simulasi tidak ditemukan!"); return; }
        ctx_sim = canvas_sim.getContext('2d');
        if (!ctx_sim) { console.error("Tidak bisa mendapatkan konteks 2D dari canvas simulasi!"); return; }

        interactionPointX_sim = canvas_sim.width / 2 - 50;
        interactionPointY_sim = canvas_sim.height / 2;
        targetPlateWidth_sim = 30;
        targetPlateHeight_sim = 80;
        targetPlateX_sim = interactionPointX_sim - targetPlateWidth_sim / 2;
        targetPlateY_sim = interactionPointY_sim - targetPlateHeight_sim / 2;

        if (thetaInputFotonElement_sim) {
            thetaInputFotonElement_sim.addEventListener('input', () => {
                if (thetaValueFotonElement_sim) thetaValueFotonElement_sim.innerText = thetaInputFotonElement_sim.value;
            });
            if (thetaValueFotonElement_sim) thetaValueFotonElement_sim.innerText = thetaInputFotonElement_sim.value;
        }

        if (tombolHitungElement_sim) {
            tombolHitungElement_sim.addEventListener('click', () => {
                if (animationId_sim) cancelAnimationFrame(animationId_sim);
                collisionOccurred_sim = false;
                hitungDanVisualisasikan_sim_function();
            });
        }
        drawInitialSimulationState_sim();
    }

    function drawInitialSimulationState_sim() {
        if (!ctx_sim || !canvas_sim) return;
        ctx_sim.clearRect(0, 0, canvas_sim.width, canvas_sim.height);
        ctx_sim.fillStyle = '#A0A0A0';
        ctx_sim.fillRect(targetPlateX_sim, targetPlateY_sim, targetPlateWidth_sim, targetPlateHeight_sim);
        ctx_sim.strokeStyle = '#606060';
        ctx_sim.strokeRect(targetPlateX_sim, targetPlateY_sim, targetPlateWidth_sim, targetPlateHeight_sim);
        drawLegend_sim_function();
    }

    function hitungDanVisualisasikan_sim_function() {
        if (!lambdaInputElement_sim || !thetaInputFotonElement_sim || !ctx_sim) return;
        const lambdaDatang_pm = parseFloat(lambdaInputElement_sim.value);
        const thetaFotonDeg = parseFloat(thetaInputFotonElement_sim.value);
        currentThetaFotonRad_math_sim = thetaFotonDeg * (Math.PI / 180);
        const lambdaDatang_m = lambdaDatang_pm * pm_to_m_factor_sim;
        const deltaLambda_m = comptonWavelength_m_sim * (1 - Math.cos(currentThetaFotonRad_math_sim));
        const lambdaAkhir_m = lambdaDatang_m + deltaLambda_m;
        const Edatang_J = (h_planck_sim * c_light_sim) / lambdaDatang_m;
        const Eakhir_J = (h_planck_sim * c_light_sim) / lambdaAkhir_m;
        const Kelectron_J = Edatang_J - Eakhir_J;
        const Edatang_keV = Edatang_J * joule_to_keV_factor_sim;
        const Eakhir_keV = Eakhir_J * joule_to_keV_factor_sim;
        const Kelectron_keV = Kelectron_J * joule_to_keV_factor_sim;
        const momentumFotonDatang_val = Edatang_J / c_light_sim;
        const momentumFotonTerhambur_x = (Eakhir_J / c_light_sim) * Math.cos(currentThetaFotonRad_math_sim);
        const momentumFotonTerhambur_y = (Eakhir_J / c_light_sim) * Math.sin(currentThetaFotonRad_math_sim);
        const momentumElektron_x = momentumFotonDatang_val - momentumFotonTerhambur_x;
        const momentumElektron_y = -momentumFotonTerhambur_y;
        currentPhiElectronRad_math_sim = Math.atan2(momentumElektron_y, momentumElektron_x);
        let phiElectronDeg = currentPhiElectronRad_math_sim * (180 / Math.PI);

        if(lambdaDatangDisplayElement_sim) lambdaDatangDisplayElement_sim.innerText = lambdaDatang_pm.toFixed(2);
        if(deltaLambdaElement_sim) deltaLambdaElement_sim.innerText = (deltaLambda_m / pm_to_m_factor_sim).toFixed(4);
        if(lambdaFinalElement_sim) lambdaFinalElement_sim.innerText = (lambdaAkhir_m / pm_to_m_factor_sim).toFixed(2);
        if(EdatangElement_sim) EdatangElement_sim.innerText = Edatang_keV.toFixed(2);
        if(EakhirElement_sim) EakhirElement_sim.innerText = Eakhir_keV.toFixed(2);
        if(KelectronElement_sim) KelectronElement_sim.innerText = Kelectron_keV.toFixed(4);
        if(thetaFotonDisplayElement_sim) thetaFotonDisplayElement_sim.innerText = thetaFotonDeg.toFixed(2);
        if(phiElectronDisplayElement_sim) phiElectronDisplayElement_sim.innerText = phiElectronDeg.toFixed(2);

        incomingPhoton_sim = { x: 30, y: interactionPointY_sim, active: true, speed: 3, phaseOffset: 0 };
        scatteredPhoton_sim = { x: interactionPointX_sim, y: interactionPointY_sim, angleRad_canvas: -currentThetaFotonRad_math_sim, active: false, speed: 4, color: 'blue' };
        recoiledElectron_sim = { x: interactionPointX_sim, y: interactionPointY_sim, angleRad_canvas: -currentPhiElectronRad_math_sim, active: false, speed: 2, color: 'red' };
        animate_sim_function();
    }
     function drawPropagatingWave_sim_function(headX, headY, angleRadCanvas, visualWavelength, amplitude, length, phaseOffset, color, isScattered = false) {
        if (!ctx_sim) return;
        ctx_sim.beginPath();
        ctx_sim.strokeStyle = color;
        ctx_sim.lineWidth = 2;

        // Simpan transformasi saat ini
        ctx_sim.save();
        // Pindahkan origin ke kepala foton dan rotasi
        ctx_sim.translate(headX, headY);
        ctx_sim.rotate(angleRadCanvas); // Rotasi sesuai arah foton (0 untuk foton datang)

        // Menggambar dari "belakang" kepala foton (sekarang di origin baru yang terotasi) ke kiri (negatif x)
        for (let i = 0; i <= length; i++) {
            const currentX_local = -i; // Posisi x lokal di sepanjang gelombang, bergerak ke kiri dari kepala
            
            // Hentikan jika sudah sangat dekat atau melewati titik interaksi jika ini foton datang
            if (!isScattered && headX + currentX_local * Math.cos(angleRadCanvas) > interactionPointX_sim - 5 && headX > interactionPointX_sim - 10) break;

            const waveAngle = ( (i * 1.0) / visualWavelength) * 2 * Math.PI - (phaseOffset / visualWavelength) * 2 * Math.PI ;
            const yOffset_local = amplitude * Math.sin(waveAngle); // y lokal relatif terhadap sumbu foton

            if (i === 0) { // Titik pertama di kepala gelombang (di origin yang sudah ditranslasikan)
                ctx_sim.moveTo(0, yOffset_local); // Kepala gelombang selalu di (0, yOffset_local) dalam sistem koordinat lokal
            } else {
                ctx_sim.lineTo(currentX_local, yOffset_local);
            }
        }
        ctx_sim.stroke();
        // Kembalikan transformasi
        ctx_sim.restore();
    }

    function drawMiniWaveIcon_sim(iconX, iconY, color) {
        if (!ctx_sim) return;
        const waveLength = 15; const amplitude = 3; const numCycles = 1.5;
        ctx_sim.beginPath(); ctx_sim.strokeStyle = color; ctx_sim.lineWidth = 1.5;
        for (let i = 0; i <= waveLength; i += 0.5) {
            const xPos = iconX + i;
            const angle = (i / (waveLength / numCycles)) * 2 * Math.PI;
            const yPos = iconY + amplitude * Math.sin(angle);
            if (i === 0) { ctx_sim.moveTo(xPos, yPos); } else { ctx_sim.lineTo(xPos, yPos); }
        }
        ctx_sim.stroke();
    }

    function drawLegend_sim_function() {
        if (!ctx_sim || !canvas_sim) return;
        const legendX = 15; let legendY = canvas_sim.height - 65; ctx_sim.font = '12px Arial';
        ctx_sim.textAlign = 'left'; ctx_sim.textBaseline = 'top'; const itemHeight = 20;
        const iconTextSpacing = 5; const waveIconLength = 20;
        const waveIconY = legendY + 6;
        drawMiniWaveIcon_sim(legendX, waveIconY, 'orange');
        ctx_sim.fillStyle = 'black';
        ctx_sim.fillText('Gelombang datang', legendX + waveIconLength + iconTextSpacing, legendY + 2);
        legendY += itemHeight;
        const blueIconX = legendX + photonRadius_sim / 2; const blueIconY = legendY + itemHeight / 2 - 2;
        ctx_sim.fillStyle = 'blue'; ctx_sim.beginPath(); ctx_sim.arc(blueIconX, blueIconY, photonRadius_sim, 0, Math.PI * 2); ctx_sim.fill();
        ctx_sim.fillStyle = 'black';
        ctx_sim.fillText('Foton Terhambur (θ)', legendX + photonRadius_sim + iconTextSpacing + 5, legendY +2);
        legendY += itemHeight;
        const redIconX = legendX + electronVisualRadius_sim / 2; const redIconY = legendY + itemHeight / 2 - 2;
        ctx_sim.fillStyle = 'red'; ctx_sim.beginPath(); ctx_sim.arc(redIconX, redIconY, electronVisualRadius_sim, 0, Math.PI * 2); ctx_sim.fill();
        ctx_sim.fillStyle = 'white'; ctx_sim.font = 'bold 9px Arial'; ctx_sim.textAlign = 'center'; ctx_sim.textBaseline = 'middle';
        ctx_sim.fillText('e⁻', redIconX, redIconY);
        ctx_sim.fillStyle = 'black'; ctx_sim.textAlign = 'left'; ctx_sim.textBaseline = 'top'; ctx_sim.font = '12px Arial';
        ctx_sim.fillText('Elektron Terpental (Φ)', legendX + electronVisualRadius_sim + iconTextSpacing + 5, legendY + 2);
    }

    function drawPropagatingWave_sim_function(headX, headY, angleRadCanvas, visualWavelength, amplitude, length, phaseOffset, color) {
        if (!ctx_sim) return;
        
        ctx_sim.save(); // Simpan state canvas (termasuk transformasi saat ini)
        
        // Pindahkan origin ke posisi kepala foton dan rotasi
        ctx_sim.translate(headX, headY);
        ctx_sim.rotate(angleRadCanvas); // Rotasi sesuai arah foton

        // Sekarang kita menggambar gelombang di sistem koordinat lokal yang sudah terotasi
        // Kepala foton ada di (0,0) lokal. Gelombang digambar ke arah X negatif lokal.
        ctx_sim.beginPath();
        ctx_sim.strokeStyle = color;
        ctx_sim.lineWidth = 2;

        for (let i = 0; i <= length; i++) {
            const currentX_local = -i; // Bergerak ke kiri (negatif x) dari kepala foton lokal
            
            // Argumen sinus untuk osilasi gelombang
            // (i / visualWavelength) menentukan berapa siklus yang sudah dilewati
            // phaseOffset menggeser fase gelombang untuk ilusi perambatan
            const waveAngle = ((i / visualWavelength) * 2 * Math.PI) - ((phaseOffset / visualWavelength) * 2 * Math.PI);
            const yOffset_local = amplitude * Math.sin(waveAngle); // Osilasi pada sumbu Y lokal

            if (i === 0) {
                ctx_sim.moveTo(0, yOffset_local); // Mulai dari kepala (atau sedikit di belakangnya jika yOffset_local != 0)
            } else {
                ctx_sim.lineTo(currentX_local, yOffset_local);
            }
        }
        ctx_sim.stroke();
        
        ctx_sim.restore(); // Kembalikan state canvas ke sebelum transformasi
    }

    function drawAngleArc_sim_function(centerX, centerY, radius, startAngleRadCanvas, endAngleRadCanvas, color, label, labelAngleOffsetFactor = 0.5) {
        if (!ctx_sim) return;
        ctx_sim.beginPath();
        ctx_sim.arc(centerX, centerY, radius, 0, endAngleRadCanvas, (endAngleRadCanvas < 0) );
        ctx_sim.strokeStyle = color; ctx_sim.lineWidth = 1.5; ctx_sim.stroke();
        const labelAngleCanvas = endAngleRadCanvas * labelAngleOffsetFactor;
        const labelRadius = radius + 15;
        const labelX = centerX + labelRadius * Math.cos(labelAngleCanvas);
        const labelY = centerY + labelRadius * Math.sin(labelAngleCanvas);
        ctx_sim.fillStyle = color; ctx_sim.font = 'bold 13px Arial'; ctx_sim.textAlign = 'center'; ctx_sim.textBaseline = 'middle';
        ctx_sim.fillText(label, labelX, labelY);
    }

    
    function animate_sim_function() {
        if (!ctx_sim || !canvas_sim) return;
        ctx_sim.clearRect(0, 0, canvas_sim.width, canvas_sim.height);
        
        // Gambar plat target
        ctx_sim.fillStyle = '#A0A0A0';
        ctx_sim.fillRect(targetPlateX_sim, targetPlateY_sim, targetPlateWidth_sim, targetPlateHeight_sim);
        ctx_sim.strokeStyle = '#606060';
        ctx_sim.strokeRect(targetPlateX_sim, targetPlateY_sim, targetPlateWidth_sim, targetPlateHeight_sim);

        const waveAmplitude_sim = 10;
        const visualWavelength_sim = 30; // Panjang gelombang visual yang lebih pendek agar terlihat merambat
        const waveDrawLength_sim = 60; // Panjang visual "ekor" gelombang

        // 1. Foton Datang
        if (incomingPhoton_sim.active) {
            // Gambar jejak gelombang datang
            drawPropagatingWave_sim_function(
                incomingPhoton_sim.x,
                incomingPhoton_sim.y,
                0, // Sudut untuk foton datang adalah 0 (horizontal)
                visualWavelength_sim,
                waveAmplitude_sim,
                waveDrawLength_sim,
                incomingPhoton_sim.phaseOffset,
                'orange'
            );
            // Gambar kepala foton datang (partikel bulat)
            ctx_sim.beginPath();
            ctx_sim.arc(incomingPhoton_sim.x, incomingPhoton_sim.y, photonRadius_sim, 0, Math.PI * 2);
            ctx_sim.fillStyle = 'orange';
            ctx_sim.fill();

            // Update posisi dan fase foton datang
            incomingPhoton_sim.x += incomingPhoton_sim.speed;
            incomingPhoton_sim.phaseOffset += incomingPhoton_sim.speed; // Fase bergerak bersama kepala

            // Deteksi tumbukan
            if (incomingPhoton_sim.x >= interactionPointX_sim) {
                incomingPhoton_sim.active = false;
                scatteredPhoton_sim.active = true;
                recoiledElectron_sim.active = true;
                collisionOccurred_sim = true;
                // Inisialisasi phaseOffset untuk foton terhambur saat tumbukan
                if (scatteredPhoton_sim.phaseOffset === undefined) scatteredPhoton_sim.phaseOffset = 0;
                 // Anda bisa juga meneruskan fase dari foton datang jika diinginkan,
                 // tapi memulai dari 0 untuk foton baru mungkin lebih sederhana:
                 scatteredPhoton_sim.phaseOffset = incomingPhoton_sim.phaseOffset; // atau 0;
            }
        }

        // 2. Gambar Garis dan Sudut setelah Tumbukan
        if (collisionOccurred_sim) {
            ctx_sim.beginPath(); ctx_sim.setLineDash([4, 4]); ctx_sim.moveTo(interactionPointX_sim, interactionPointY_sim);
            ctx_sim.lineTo(canvas_sim.width - 20, interactionPointY_sim); ctx_sim.strokeStyle = '#777777';
            ctx_sim.lineWidth = 1; ctx_sim.stroke(); ctx_sim.setLineDash([]);
            
            // Gambar sudut hanya jika partikel sudah aktif atau setidaknya tumbukan sudah terjadi
            // dan pastikan partikelnya punya angleRad_canvas
             if (scatteredPhoton_sim.angleRad_canvas !== undefined && recoiledElectron_sim.angleRad_canvas !== undefined ) {
                drawAngleArc_sim_function(interactionPointX_sim, interactionPointY_sim, 45, 0, scatteredPhoton_sim.angleRad_canvas, scatteredPhoton_sim.color, 'θ');
                drawAngleArc_sim_function(interactionPointX_sim, interactionPointY_sim, 70, 0, recoiledElectron_sim.angleRad_canvas, recoiledElectron_sim.color, 'Φ');
            }
        }

        // 3. Foton Terhambur
        if (scatteredPhoton_sim.active) {
            // Gambar jejak gelombang foton terhambur
            drawPropagatingWave_sim_function(
                scatteredPhoton_sim.x,
                scatteredPhoton_sim.y,
                scatteredPhoton_sim.angleRad_canvas, // Sudut hamburan foton
                visualWavelength_sim, // Bisa diubah jika ingin merepresentasikan perubahan panjang gelombang visual
                waveAmplitude_sim,
                waveDrawLength_sim,
                scatteredPhoton_sim.phaseOffset,
                scatteredPhoton_sim.color
            );
            // Gambar kepala foton terhambur (partikel bulat)
            ctx_sim.beginPath();
            ctx_sim.arc(scatteredPhoton_sim.x, scatteredPhoton_sim.y, photonRadius_sim, 0, Math.PI * 2);
            ctx_sim.fillStyle = scatteredPhoton_sim.color;
            ctx_sim.fill();

            // Update posisi dan fase foton terhambur
            scatteredPhoton_sim.x += scatteredPhoton_sim.speed * Math.cos(scatteredPhoton_sim.angleRad_canvas);
            scatteredPhoton_sim.y += scatteredPhoton_sim.speed * Math.sin(scatteredPhoton_sim.angleRad_canvas);
            if (scatteredPhoton_sim.phaseOffset === undefined) scatteredPhoton_sim.phaseOffset = 0;
            scatteredPhoton_sim.phaseOffset += scatteredPhoton_sim.speed;
        }

        // 4. Elektron Terpental
        if (recoiledElectron_sim.active) {
            ctx_sim.beginPath(); ctx_sim.arc(recoiledElectron_sim.x, recoiledElectron_sim.y, electronVisualRadius_sim, 0, Math.PI * 2);
            ctx_sim.fillStyle = recoiledElectron_sim.color; ctx_sim.fill();
            ctx_sim.fillStyle = 'white'; ctx_sim.font = 'bold 10px Arial'; ctx_sim.textAlign = 'center'; ctx_sim.textBaseline = 'middle';
            ctx_sim.fillText('e⁻', recoiledElectron_sim.x, recoiledElectron_sim.y);
            
            recoiledElectron_sim.x += recoiledElectron_sim.speed * Math.cos(recoiledElectron_sim.angleRad_canvas);
            recoiledElectron_sim.y += recoiledElectron_sim.speed * Math.sin(recoiledElectron_sim.angleRad_canvas);
        }

        // 5. Gambar Legenda
        drawLegend_sim_function();
        
        // Loop animasi berikutnya
        animationId_sim = requestAnimationFrame(animate_sim_function);
    }
});