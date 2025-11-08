import { supabase } from '@/integrations/supabase/client';

/**
 * Setup script to create the initial admin account
 * This should be called once during initial setup
 * 
 * Admin credentials:
 * Username: admin_aiml
 * Password: sameer@aiml
 */
export const setupInitialAdmin = async () => {
  try {
    const response = await supabase.functions.invoke('create-admin', {
      body: {
        username: 'admin_aiml',
        password: 'sameer@aiml',
        fullName: 'Admin AIML'
      }
    });

    if (response.error) {
      console.error('Error creating admin:', response.error);
      return { success: false, error: response.error };
    }

    console.log('Admin account created successfully:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error in setupInitialAdmin:', error);
    return { success: false, error };
  }
};
