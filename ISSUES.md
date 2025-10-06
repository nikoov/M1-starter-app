# M1

## List of issues

### Issue 1: Broken Error Handler Middleware Missing Function Signature

**Description**: The `notFoundHandler` function in `backend/src/errorHandler.middleware.ts` is missing its function signature and parameters, causing a syntax error that prevents the server from starting properly.

**How it was fixed?**: Added the missing function signature `(req: Request, res: Response) => {` to properly define the middleware function.

### Issue 2: Inconsistent Error Response Format Across API Endpoints

**Description**: Different API endpoints return inconsistent error response formats. Some return `{ message: string }`, others return `{ error: string, message: string }`, and some include additional fields like `details`. This makes error handling difficult for the frontend.

**How it was fixed?**: Standardized error responses to follow a consistent format with `error`, `message`, and optional `details` fields across all endpoints.

### Issue 3: Image Deletion Logic Has Path Resolution Bugs

**Description**: The `MediaService.deleteImage()` method has flawed path resolution logic that can fail to delete images properly. It uses inconsistent path separators and doesn't handle absolute vs relative paths correctly, leading to orphaned files.

**How it was fixed?**: Fixed path normalization and resolution logic to properly handle both absolute and relative paths, ensuring images are deleted correctly.

### Issue 4: Missing Input Validation for File Uploads

**Description**: The media upload endpoint lacks proper validation for file types, sizes, and malicious content. While multer has basic file filtering, there's no additional validation for file content or size limits beyond the 5MB limit.

**How it was fixed?**: Added comprehensive file validation including MIME type verification, file size limits, and basic content validation to prevent malicious uploads.

### Issue 5: Frontend Auth Screen Has Duplicate Sign-In/Sign-Up Logic

**Description**: The `AuthScreen.kt` has identical logic for both sign-in and sign-up buttons - both call `authViewModel.signInWithGoogle()` instead of having separate flows. This creates confusion and potential bugs in the authentication flow.

**How it was fixed?**: Separated the sign-in and sign-up flows to call appropriate methods (`handleGoogleSignInResult` vs `handleGoogleSignUpResult`) and added proper error handling for each flow.
