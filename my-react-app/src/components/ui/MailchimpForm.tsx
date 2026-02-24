import { useEffect } from 'react';
import Button from './Button';
import { useTranslation } from 'react-i18next';

const MailchimpForm = () => {
    const { t } = useTranslation(['common', 'home']);

    useEffect(() => {
        // Load Mailchimp scripts
        const script1 = document.createElement('script');
        script1.src = "//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js";
        script1.type = "text/javascript";
        script1.async = true;
        document.body.appendChild(script1);

        const script2 = document.createElement('script');
        script2.type = "text/javascript";
        script2.innerHTML = `
            (function($) {
                window.fnames = new Array(); 
                window.ftypes = new Array();
                fnames[0]='EMAIL';ftypes[0]='email';
                fnames[4]='PHONE';ftypes[4]='phone';
                fnames[1]='FNAME';ftypes[1]='text';
                fnames[2]='LNAME';ftypes[2]='text';
                fnames[3]='ADDRESS';ftypes[3]='address';
                fnames[5]='BIRTHDAY';ftypes[5]='birthday';
                fnames[6]='COMPANY';ftypes[6]='text';
            }(jQuery));
            var $mcj = jQuery.noConflict(true);
        `;
        document.body.appendChild(script2);

        return () => {
            // Cleanup scripts on unmount if necessary
            document.body.removeChild(script1);
            document.body.removeChild(script2);
        };
    }, []);

    return (
        <div id="mc_embed_shell" className="w-full max-w-4xl mx-auto">
            <link href="//cdn-images.mailchimp.com/embedcode/classic-061523.css" rel="stylesheet" type="text/css" />
            <style type="text/css">
                {`
                #mc_embed_signup{background:transparent; clear:left; font-family: inherit; width: 100%;}
                /* Custom overrides to match theme */
                #mc_embed_signup input.email, 
                #mc_embed_signup input.text {
                    border-radius: 0.5rem;
                    padding: 0.75rem 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    background-color: white;
                    color: #1a1a1a;
                    width: 100%;
                    font-size: 1rem;
                    transition: all 0.2s;
                }
                #mc_embed_signup input:focus {
                    outline: none;
                    border-color: var(--color-secondary);
                    box-shadow: 0 0 0 2px rgba(218, 165, 32, 0.2);
                }
                #mc_embed_signup .mc-field-group label {
                    color: white;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    display: block;
                    font-size: 0.875rem;
                    letter-spacing: 0.025em;
                }
                /* Success/Error messages */
                #mc_embed_signup #mce-success-response {
                    color: #ffffff;
                    font-weight: 500;
                    margin: 1.5rem 0;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    background: rgba(74, 222, 128, 0.2);
                    border: 1px solid rgba(74, 222, 128, 0.3);
                }
                #mc_embed_signup #mce-error-response {
                    color: #ffffff;
                    font-weight: 500;
                    margin: 1.5rem 0;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    background: rgba(248, 113, 113, 0.2);
                    border: 1px solid rgba(248, 113, 113, 0.3);
                }
                .asterisk { color: #f87171; margin-left: 2px; }
                `}
            </style>
            <div id="mc_embed_signup">
                <form
                    action="https://lindbergsafaris.us14.list-manage.com/subscribe/post?u=4b7c04ad3d6fe4e8c3b114ff4&amp;id=0b2e63fece&amp;f_id=00a12ae1f0"
                    method="post"
                    id="mc-embedded-subscribe-form"
                    name="mc-embedded-subscribe-form"
                    className="validate"
                    target="_blank"
                    noValidate
                >
                    <div id="mc_embed_signup_scroll">
                        <div className="flex flex-col md:flex-row items-end gap-4 md:gap-6">
                            <div className="mc-field-group flex-[2] w-full text-left">
                                <label htmlFor="mce-EMAIL">
                                    Email Address <span className="asterisk">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="EMAIL"
                                    className="required email"
                                    id="mce-EMAIL"
                                    required
                                    defaultValue=""
                                    placeholder={t('home:newsletter.placeholder')}
                                />
                            </div>
                            <div className="mc-field-group flex-[1.5] w-full text-left">
                                <label htmlFor="mce-PHONE">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    name="PHONE"
                                    className="REQ_CSS"
                                    id="mce-PHONE"
                                    defaultValue=""
                                    placeholder="Phone (Optional)"
                                />
                            </div>

                            <div className="optionalParent w-full md:w-auto">
                                <div className="clear foot">
                                    <Button
                                        type="submit"
                                        name="subscribe"
                                        id="mc-embedded-subscribe"
                                        variant="secondary"
                                        size="lg"
                                        className="w-full md:w-auto px-10 h-[50px] font-bold shadow-lg transform transition active:scale-95"
                                    >
                                        {t('common:buttons.subscribeNow')}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div id="mce-responses" className="clear foot">
                            <div className="response" id="mce-error-response" style={{ display: 'none' }}></div>
                            <div className="response" id="mce-success-response" style={{ display: 'none' }}></div>
                        </div>

                        {/* honeypot anti-bot field */}
                        <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
                            <input type="text" name="b_4b7c04ad3d6fe4e8c3b114ff4_0b2e63fece" tabIndex={-1} defaultValue="" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MailchimpForm;
