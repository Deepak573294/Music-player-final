
public class AuthController {
    
    private final AuthService authService;
    private final ValidationService validationService;
    private final LoggingService loggingService;

    public AuthController(AuthService authService, 
                         ValidationService validationService,
                         LoggingService loggingService) {
        this.authService = authService;
        this.validationService = validationService;
        this.loggingService = loggingService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            validationService.validateLoginRequest(request);
            AuthResponse response = authService.login(request);
            loggingService.logSuccessfulLogin(request.getEmail());
            return ResponseEntity.ok(response);
        } catch (ValidationException e) {
            loggingService.logValidationError(e);
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        } catch (AuthenticationException e) {
            loggingService.logAuthenticationError(e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(e.getMessage()));
        }
    }

    // Similar improvements for other endpoints...
}
