"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import {
  formatDateToDisplay,
  parseMaskedDate,
  type AddKidFormData,
} from "@/lib/kids-store";

const ROOMS = ["Soles", "Lunas", "Estrellas"] as const;
type RoomName = (typeof ROOMS)[number];

interface FieldErrors {
  fullName?: string;
  birthDate?: string;
  roomName?: string;
}

interface AddKidModalProps {
  onClose: () => void;
  onSave: (data: AddKidFormData) => void;
}

const INPUT_BASE_CLASSES =
  "w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-[#3F362E] outline-none transition-colors placeholder:text-[#B6A99B]";
const INPUT_NORMAL_CLASSES =
  "border-[#EADFD0] focus:border-[#F2A78E] focus:ring-2 focus:ring-[#F6A98E]/25";
const INPUT_ERROR_CLASSES =
  "border-[#D9583C] bg-[#FFF9F6] focus:border-[#D9583C] focus:ring-2 focus:ring-[#D9583C]/20";

const LABEL_CLASSES =
  "mb-2 block text-[12px] font-extrabold tracking-[.7px] text-[#94887B]";

const ERROR_TEXT_CLASSES = "mt-1.5 text-[12.5px] font-bold text-[#C5503A]";

function formatDateMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
}

function cursorPositionForDigits(digitCount: number): number {
  return (
    digitCount +
    (digitCount >= 3 ? 1 : 0) +
    (digitCount >= 5 ? 1 : 0)
  );
}

export function AddKidModal({ onClose, onSave }: AddKidModalProps) {
  const [fullName, setFullName] = useState("");
  const [dateDisplay, setDateDisplay] = useState("");
  const [roomName, setRoomName] = useState<RoomName>("Soles");
  const [allergiesText, setAllergiesText] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const titleId = useId();
  const nameErrorId = useId();
  const dateErrorId = useId();
  const roomErrorId = useId();

  const birthDate = useMemo(
    () => parseMaskedDate(dateDisplay),
    [dateDisplay],
  );

  const clearError = (field: keyof FieldErrors) => {
    setErrors((previous) => {
      if (!previous[field]) {
        return previous;
      }

      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    nameInputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.target instanceof Element &&
      event.target.closest("[data-add-kid-card]")
    ) {
      return;
    }

    onClose();
  };

  const handleDateChange = (value: string) => {
    setDateDisplay(formatDateMask(value));
    clearError("birthDate");
  };

  const handleDateKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Backspace") {
      return;
    }

    const input = event.currentTarget;
    const { selectionStart, selectionEnd, value } = input;

    if (
      selectionStart === null ||
      selectionStart !== selectionEnd ||
      selectionStart === 0 ||
      value.charAt(selectionStart - 1) !== "-"
    ) {
      return;
    }

    event.preventDefault();

    const digits = value.replace(/\D/g, "");
    const digitsBeforeCursor = value
      .slice(0, selectionStart)
      .replace(/\D/g, "").length;
    const nextDigits =
      digits.slice(0, digitsBeforeCursor - 1) +
      digits.slice(digitsBeforeCursor);
    const nextDisplay = formatDateMask(nextDigits);

    setDateDisplay(nextDisplay);
    clearError("birthDate");

    const nextCursor = cursorPositionForDigits(
      Math.max(digitsBeforeCursor - 1, 0),
    );

    requestAnimationFrame(() => {
      dateInputRef.current?.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FieldErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Ingresá el nombre completo.";
    }

    if (!dateDisplay.trim()) {
      nextErrors.birthDate = "La fecha de nacimiento es obligatoria.";
    } else if (!birthDate) {
      nextErrors.birthDate =
        "Ingresá una fecha válida (dd-mm-aaaa) que no sea futura.";
    }

    if (!roomName) {
      nextErrors.roomName = "Seleccioná una sala.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !birthDate) {
      return;
    }

    onSave({
      fullName: fullName.trim(),
      birthDate,
      birthDateText: formatDateToDisplay(birthDate),
      roomName,
      allergiesText: allergiesText.trim(),
      medicalNotes: medicalNotes.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 animate-[modal-overlay-in_150ms_ease-out] overflow-y-auto bg-[#3F362E]/40 backdrop-blur-[2px] motion-reduce:animate-none"
      onMouseDown={handleBackdropMouseDown}
    >
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          data-add-kid-card
          className="w-full max-w-[520px] animate-[modal-card-in_180ms_ease-out] overflow-hidden rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] motion-reduce:animate-none"
        >
          <form noValidate onSubmit={handleSubmit}>
            <div className="flex items-center justify-between border-b border-[#ECE0D0] px-[26px] py-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md text-[15px] font-bold text-[#94887B] outline-none transition-colors hover:text-[#6E6359] focus-visible:ring-2 focus-visible:ring-[#F2A78E]/50"
              >
                Cancelar
              </button>
              <span
                id={titleId}
                className="font-display text-[18px] font-semibold text-[#3F362E]"
              >
                Agregar niño
              </span>
              <button
                type="submit"
                className="rounded-md text-[15px] font-extrabold text-[#D9583C] outline-none transition-colors hover:text-[#B8452C] focus-visible:ring-2 focus-visible:ring-[#F2A78E]/50"
              >
                Guardar
              </button>
            </div>

            <div className="px-[26px] py-6">
              <label htmlFor="add-kid-name" className={LABEL_CLASSES}>
                NOMBRE COMPLETO
              </label>
              <input
                ref={nameInputRef}
                id="add-kid-name"
                type="text"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  clearError("fullName");
                }}
                placeholder="Ej. Martina López"
                aria-required="true"
                aria-invalid={errors.fullName ? true : undefined}
                aria-describedby={
                  errors.fullName ? nameErrorId : undefined
                }
                className={`${INPUT_BASE_CLASSES} mb-[18px] ${
                  errors.fullName ? INPUT_ERROR_CLASSES : INPUT_NORMAL_CLASSES
                }`}
              />
              {errors.fullName ? (
                <p id={nameErrorId} role="alert" className={`${ERROR_TEXT_CLASSES} -mt-3 mb-[18px]`}>
                  {errors.fullName}
                </p>
              ) : null}

              <div className="mb-[18px] flex flex-col gap-[18px] sm:flex-row sm:gap-[14px]">
                <div className="min-w-0 flex-1">
                  <label htmlFor="add-kid-birthdate" className={LABEL_CLASSES}>
                    FECHA DE NACIMIENTO
                  </label>
                  <input
                    ref={dateInputRef}
                    id="add-kid-birthdate"
                    type="text"
                    inputMode="numeric"
                    autoComplete="bday"
                    maxLength={10}
                    value={dateDisplay}
                    onChange={(event) => handleDateChange(event.target.value)}
                    onKeyDown={handleDateKeyDown}
                    placeholder="dd-mm-aaaa"
                    aria-required="true"
                    aria-invalid={errors.birthDate ? true : undefined}
                    aria-describedby={
                      errors.birthDate ? dateErrorId : undefined
                    }
                    className={`${INPUT_BASE_CLASSES} ${
                      errors.birthDate
                        ? INPUT_ERROR_CLASSES
                        : INPUT_NORMAL_CLASSES
                    }`}
                  />
                  {errors.birthDate ? (
                    <p id={dateErrorId} role="alert" className={ERROR_TEXT_CLASSES}>
                      {errors.birthDate}
                    </p>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <label htmlFor="add-kid-room" className={LABEL_CLASSES}>
                    SALA
                  </label>
                  <div className="relative">
                    <select
                      id="add-kid-room"
                      value={roomName}
                      onChange={(event) => {
                        setRoomName(event.target.value as RoomName);
                        clearError("roomName");
                      }}
                      aria-required="true"
                      aria-invalid={errors.roomName ? true : undefined}
                      aria-describedby={
                        errors.roomName ? roomErrorId : undefined
                      }
                      className={`${INPUT_BASE_CLASSES} appearance-none pr-10 font-bold ${
                        errors.roomName
                          ? INPUT_ERROR_CLASSES
                          : INPUT_NORMAL_CLASSES
                      }`}
                    >
                      {ROOMS.map((room) => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#B0A290"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                  {errors.roomName ? (
                    <p id={roomErrorId} role="alert" className={ERROR_TEXT_CLASSES}>
                      {errors.roomName}
                    </p>
                  ) : null}
                </div>
              </div>

              <label htmlFor="add-kid-allergies" className={LABEL_CLASSES}>
                ALERGIAS (ETIQUETAS)
              </label>
              <input
                id="add-kid-allergies"
                type="text"
                value={allergiesText}
                onChange={(event) => setAllergiesText(event.target.value)}
                placeholder="Ej. Maní, Lactosa"
                className={`${INPUT_BASE_CLASSES} mb-[18px] ${INPUT_NORMAL_CLASSES}`}
              />

              <label htmlFor="add-kid-notes" className={LABEL_CLASSES}>
                NOTAS MÉDICAS
              </label>
              <textarea
                id="add-kid-notes"
                value={medicalNotes}
                onChange={(event) => setMedicalNotes(event.target.value)}
                placeholder="Indicaciones, medicación, contactos…"
                className={`${INPUT_BASE_CLASSES} min-h-[90px] resize-y leading-normal ${INPUT_NORMAL_CLASSES}`}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
