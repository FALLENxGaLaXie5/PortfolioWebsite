import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { motion } from "motion/react";
import emailjs from "@emailjs/browser";

import { HoloGlobeCanvas } from "./canvas";
import LazyMount from "./LazyMount";
import Spinner from "./Spinner";
import SectionHeader from "./SectionHeader";
import { SectionWrapper } from "../hoc";
import { fadeIn } from "../utils/motion";

const fieldClass =
  "w-full rounded-control border border-line bg-tertiary px-4 py-3.5 text-base font-medium text-white placeholder:text-muted transition-colors hover:border-line-strong focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:px-5";

const labelClass = "mb-2.5 block text-base font-medium text-white";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      VITE_APP_EMAILJS_SERVICE_ID: serviceId,
      VITE_APP_EMAILJS_TEMPLATE_ID: templateId,
      VITE_APP_EMAILJS_PUBLIC_KEY: publicKey,
    } = import.meta.env;

    if (!serviceId || !templateId || !publicKey) {
      console.error(
        "EmailJS is not configured: set VITE_APP_EMAILJS_SERVICE_ID, VITE_APP_EMAILJS_TEMPLATE_ID and VITE_APP_EMAILJS_PUBLIC_KEY.",
      );
      alert("Something went wrong. Please try again.");
      return;
    }

    setLoading(true);

    emailjs
      .send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          to_name: "Joshua",
          from_email: form.email,
          to_email: "steward.joshua@rocketmail.com",
          message: form.message,
        },
        publicKey,
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. I will get back to you as soon as possible.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error: unknown) => {
          setLoading(false);
          console.error(error);

          alert("Something went wrong. Please try again.");
        }
      );
  };

  return (
    <div className='grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10'>
      <motion.div
        variants={fadeIn("right", "", 0.1, 0.7)}
        className='card-surface p-5 xs:p-6 sm:p-8 lg:p-10'
      >
        <SectionHeader eyebrow='Get in touch' title='Contact.' />

        <form
          onSubmit={handleSubmit}
          className='mt-8 flex flex-col gap-6 sm:mt-10'
          aria-busy={loading}
        >
          <div>
            <label htmlFor='contact-name' className={labelClass}>
              Your name
            </label>
            <input
              id='contact-name'
              type='text'
              name='name'
              autoComplete='name'
              required
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor='contact-email' className={labelClass}>
              Your email
            </label>
            <input
              id='contact-email'
              type='email'
              name='email'
              autoComplete='email'
              inputMode='email'
              spellCheck={false}
              required
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email address?"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor='contact-message' className={labelClass}>
              Your message
            </label>
            <textarea
              id='contact-message'
              rows={6}
              name='message'
              autoComplete='off'
              required
              value={form.message}
              onChange={handleChange}
              placeholder='What would you like to say?'
              className={`${fieldClass} min-h-36 resize-y`}
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='inline-flex min-h-12 w-full items-center justify-center rounded-control bg-accent-strong px-8 text-base font-bold text-white shadow-glow transition-[background-color,transform] duration-200 hover:bg-accent active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:w-fit'
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={fadeIn("left", "", 0.2, 0.7)}
        className='h-[300px] xs:h-[360px] md:h-[460px] lg:h-auto lg:min-h-[560px]'
      >
        <LazyMount
          className='size-full'
          fallback={
            <div className='flex size-full items-center justify-center'>
              <Spinner />
            </div>
          }
        >
          <HoloGlobeCanvas />
        </LazyMount>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
