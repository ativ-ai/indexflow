
import React from 'react';

const ContactForm: React.FC = () => {
    return (
        <div className="pt-8 mt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Us</h2>
            <p className="text-slate-600 mb-6">
                Have questions or feedback? Fill out the form below.
            </p>
            <form 
                action="mailto:indexflow@ativ.ai" 
                method="POST" 
                encType="text/plain"
            >
                <input type="hidden" name="subject" value="IndexFlow Feedback" />
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Your Name</label>
                        <input
                            type="text"
                            name="Name"
                            id="name"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-600 focus:border-sky-600 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Your Email</label>
                        <input
                            type="email"
                            name="Email"
                            id="email"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-600 focus:border-sky-600 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
                        <textarea
                            name="Message"
                            id="message"
                            rows={4}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-600 focus:border-sky-600 sm:text-sm"
                        ></textarea>
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-sky-600 transition-all duration-300"
                    >
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
